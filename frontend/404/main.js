var text = $("#text");

setTimeout((_) => text.text("40"),  10000);
setTimeout((_) => text.text("4"),   10500);
setTimeout((_) => text.text(""),    11000);

setTimeout((_) => text.text("2"),   14000);
setTimeout((_) => text.text("20"),  14500);
setTimeout((_) => text.text("200"), 15000);