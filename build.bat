CALL git add --all
CALL git commit -am "changes"
CALL javascript-obfuscator ballscriptOriginal.js --output ballscript.js --debug-protection true --dead-code-injection true
CALL git commit -am "obfuscate code"
CALL git push origin main
