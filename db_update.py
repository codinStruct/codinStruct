# Please use the Black formatter

from dotenv import load_dotenv
import os
import pymysql
import sys
import xml.etree.ElementTree as ET

load_dotenv()

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USR = os.environ.get("DB_USR", "mysql")
DB_PWD = os.environ.get("DB_PWD", "")
DB_NAME = os.environ.get("DB_NAME", "codinstruct")
# The constants representing table names are not always escaped in the SQL, be
#  careful when changing them.
DB_TBL_LANGS = "langs"
DB_TBL_LANGS_SCHEMA = """(
    name VARCHAR(255),
    path_rel VARCHAR(255) UNIQUE NOT NULL,

    PRIMARY KEY (name)
)"""
DB_TBL_PAGES = "pages"
DB_TBL_PAGES_SCHEMA = f"""(
    lang     VARCHAR(255),
    pos      INTEGER      UNSIGNED,
    path_rel VARCHAR(255) NOT NULL UNIQUE,
    title    VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,

    PRIMARY KEY(lang, pos),
    FOREIGN KEY(lang) REFERENCES {DB_TBL_LANGS}(name),
    UNIQUE(title, category)
)"""
# Names for the temporary tables that will be created during the update script
#  execution.
DB_TBL_LANGS_TMP = DB_TBL_LANGS + "_tmp"
DB_TBL_PAGES_TMP = DB_TBL_PAGES + "_tmp"

CONTENT_PATH = os.path.join(os.path.dirname(__file__), "codinStruct-content")
CONTENT_XML_PATH_REL = "Content/languages.xml"
CONTENT_CONV_PATH = os.path.join(
    os.path.dirname(__file__), "codinStruct-content-Converted"
)


def yesNoQuestion(
    question: str,
    *,
    on_yes=None,
    on_no=None,
    yes: str = "y",
    no: str = "n",
    case_sensitive: bool = False,
) -> bool:
    result = (
        input(f"{question} ({yes}/{no}): ") == yes
        if case_sensitive
        else input(f"{question} ({yes}/{no}): ").casefold() == yes.casefold()
    )

    if result and on_yes is not None:
        on_yes()
    elif not result and on_no is not None:
        on_no()
    return result


def dbCheckTables(connection: pymysql.Connection):
    with connection.cursor() as cur:
        # Checks if languages table already exists
        cur.execute(
            f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = %s",
            (DB_TBL_LANGS,),
        )
        if cur.fetchone()[0] == 0:
            yesNoQuestion(
                f'A tabela de linguagens não foi encontrada. Criar a tabela "{DB_TBL_LANGS}"?',
                on_no=lambda: sys.exit(0),
            )
            # Create table
            cur.execute(f"CREATE TABLE {DB_TBL_LANGS}{DB_TBL_LANGS_SCHEMA}")

        # Checks if pages table already exists
        cur.execute(
            f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = %s",
            (DB_TBL_PAGES,),
        )
        if cur.fetchone()[0] == 0:
            yesNoQuestion(
                f'A tabela de páginas não foi encontrada. Criar a tabela "{DB_TBL_PAGES}"?',
                on_no=lambda: sys.exit(0),
            )
            # Create table
            cur.execute(f"CREATE TABLE {DB_TBL_PAGES} {DB_TBL_PAGES_SCHEMA}")

        # Create a temporary table
        # It will fail hard if the table already exists, but if it exists
        #  the database is already f***** up.
        cur.execute(f"CREATE TEMPORARY TABLE {DB_TBL_LANGS_TMP} LIKE {DB_TBL_LANGS}")


def main():
    # Creates database connection
    with pymysql.connect(
        host=DB_HOST, user=DB_USR, password=DB_PWD, database=DB_NAME
    ) as conn:
        dbCheckTables(connection=conn)

        with conn.cursor() as cur:
            with open(os.path.join(CONTENT_PATH, CONTENT_XML_PATH_REL)) as xml_file:
                tree = ET.parse(xml_file)
                langs = tree.getroot()
                for lang in langs:
                    lang_title = lang.attrib["title"]
                    lang_path_rel = lang.attrib["path"]

                    # Inserts language into the temporary table
                    cur.execute(
                        f"INSERT INTO {DB_TBL_LANGS_TMP} (name, path_rel) VALUES (%s, %s)",
                        (lang_title, lang_path_rel),
                    )

                    # Finds languages that are in the XML but not in the database
                    cur.execute(
                        f"SELECT NEW.name FROM {DB_TBL_LANGS_TMP} NEW LEFT JOIN {DB_TBL_LANGS} OLD ON OLD.name = NEW.name WHERE OLD.name IS NULL"
                    )
                    for row in cur.fetchall():
                        print(f"Nova linguagem encontrada: {row[0]}")

                    # Finds languages that are in the database but not in the XML
                    cur.execute(
                        f"SELECT OLD.name FROM {DB_TBL_LANGS} OLD LEFT JOIN {DB_TBL_LANGS_TMP} NEW ON OLD.name = NEW.name WHERE NEW.name IS NULL"
                    )
                    for row in cur.fetchall():
                        print(f"Linguagem perdida: {row[0]}")

                    # TODO: Resolve conflicts interactively
                    print("Agora falta solucionar interativamente os conflitos")


if __name__ == "__main__":
    sys.exit(main())
