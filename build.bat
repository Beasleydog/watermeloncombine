CALL git add --all
CALL git commit -am "changes"
CALL javascript-obfuscator ballscriptOriginal.js --dead-code-injection true --output ballscript.js
CALL javascript-obfuscator GameAPIOriginal.js --dead-code-injection true --output GameAPI.js
CALL git commit -am "obfuscate code"
CALL git push origin main
