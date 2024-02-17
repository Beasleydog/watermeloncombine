CALL git add --all
CALL git commit -am "changes"
CALL copy /y localIndex.html index.html
CALL javascript-obfuscator ballscript.js
CALL git commit -am "obfuscate code"
CALL git push origin main
