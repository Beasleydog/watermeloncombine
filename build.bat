CALL git commit -am "changes"
CALL javascript-obfuscator ballscript.js
CALL git commit -am "obfuscate code"
CALL git push origin main
