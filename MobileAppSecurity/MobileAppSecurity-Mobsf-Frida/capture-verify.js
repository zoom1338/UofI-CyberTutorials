// capture-verify.js
Java.perform(function () {
  var MainCls = "sg.vantagepoint.uncrackable1.MainActivity";
  var S = Java.use('java.lang.String');

  // preserve original equals
  var origEquals = S.equals.overload('java.lang.Object');

  // global flag we toggle while verify runs
  var verify_flag = { active: false };

  // override equals to log comparisons while verify_flag.active
  S.equals.overload('java.lang.Object').implementation = function (other) {
    if (verify_flag.active) {
      try {
        // log both strings (this and other) — other may be null or non-string
        var left = this ? this.toString() : "NULL";
        var right = (other && other.toString) ? other.toString() : String(other);
        console.log("[String.equals] LEFT  => " + left);
        console.log("[String.equals] RIGHT => " + right);
      } catch (e) {
        console.log("[String.equals] logging failed: " + e);
      }
    }
    // call original equals (avoid recursion)
    return origEquals.call(this, other);
  };

  // Hook MainActivity.verify(View)
  try {
    var Main = Java.use(MainCls);
    var origVerify = Main.verify.overload('android.view.View');
    origVerify.implementation = function (v) {
      console.log("[hook] MainActivity.verify(View) invoked - enabling capture");

      // set flag so equals will log
      verify_flag.active = true;

      // Try to enumerate any EditText instances currently in the heap and print their text
      try {
        Java.choose("android.widget.EditText", {
          onMatch: function (instance) {
            try {
              var txt = instance.getText();
              // txt might be an Editable; call toString()
              var s = txt ? txt.toString() : "<empty>";
              console.log("[EditText found] text => " + s);
            } catch (e) {
              console.log("[EditText] error reading text: " + e);
            }
          },
          onComplete: function () { console.log("[EditText] enumeration complete"); }
        });
      } catch (e) {
        console.log("[EditText] Java.choose failed: " + e);
      }

      // Call original verify (so app behaves normally) while we capture equals() calls
      try {
        var res = origVerify.call(this, v);
      } catch (ex) {
        console.log("[hook] original verify threw: " + ex);
      }

      // disable capture immediately after
      verify_flag.active = false;
      console.log("[hook] MainActivity.verify(View) finished - capture disabled");
      return;
    };
    console.log("[capture-verify] hooks installed");
  } catch (e) {
    console.log("[capture-verify] failed to hook MainActivity.verify: " + e);
  }
});
