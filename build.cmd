@ECHO OFF
CLS

CMD /C .\node_modules\.bin\grunt --gruntfile "gruntfile.js" cleanTask --color
CMD /C .\node_modules\.bin\grunt --gruntfile "gruntfile.js" buildTask --color