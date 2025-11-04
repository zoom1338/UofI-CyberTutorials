Java.perform(() => {
  function dumpMethods(cls) {
    try {
      const klass = Java.use(cls);
      const methods = klass.class.getDeclaredMethods();
      console.log("\n=== " + cls + " ===");
      methods.forEach(m => console.log("  " + m.toString()));
    } catch (e) { console.log("! " + cls + " -> " + e); }
  }
  ["sg.vantagepoint.a.b",
   "sg.vantagepoint.a.c",
   "sg.vantagepoint.uncrackable1.MainActivity"
  ].forEach(dumpMethods);
  console.log("[enum-methods] done");
});

