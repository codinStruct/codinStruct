<?php
class Database
{
    // Use these constants in SQL statements. Don't hardcode table/column names!
    private const TABLE_USERS = "users";
    private const TABLE_USERS_COL_EMAIL = "email";
    private const TABLE_USERS_COL_PASSWORD = "password";

    private mysqli $link;

    function __construct($hostname = null, $username = null, $password = null, $database = "codinstruct")
    {
        $this->connect($hostname, $username, $password, $database);
    }

    function __destruct()
    {
        $this->close();
    }

    private function connect($hostname, $username, $password, $database)
    {
        $this->link = new mysqli($hostname, $username, $password, $database);
        if (!$this->link)
            throw new Exception("Could not connect to database");
    }

    function userExists($email)
    {
        // SELECT * FROM TABLE_USERS WHERE TABLE_USERS_COL_EMAIL=EMAIL
        $stmt = $this->link->prepare(
            "SELECT * FROM " . self::TABLE_USERS . " WHERE "
                . self::TABLE_USERS_COL_EMAIL . "=?"
        );

        $stmt->bind_param("s", $email);

        if (!$stmt->execute())
            throw new Exception("Failed to check user existence");

        return (bool) $stmt->get_result()->num_rows;
    }

    function userLogin($email, $password)
    {
        // TODO: Return true if email and password match, false otherwise
    }

    function userRegister($email, $password)
    {
        if (!$this->userExists($email)) {
            // TODO: Add user to database

            return true;
        }

        return false;
    }

    private function close()
    {
        $this->link->close();
    }
}
