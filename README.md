# srteditor

**S**imple **R**ich **T**ext editor

[![Size](https://img.shields.io/github/repo-size/joshraphael/srteditor)](https://github.com/joshraphael/srteditor/archive/master.zip) [![License](https://img.shields.io/github/license/joshraphael/srteditor)](https://choosealicense.com/licenses/mit/) [![Language count](https://img.shields.io/github/languages/count/joshraphael/srteditor)](https://gitlab.com/joshraphael/srteditor/graphs/master/charts)

Creates a text box that can be used to render rich text and export as html.

This project uses the following packages:
* [jQuery](http://jquery.com) -- Easy JavaScript selectors
* [Font Awesome](https://fontawesome.com) -- CSS icons


Add an `iframe` to your html and create a selector to load the srteditor when the document is read. Each srteditor can take an optional callback function for a submit button action, and is given the document inside of the event data var `event.data.doc`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"></meta>
    <title>
      SRTEditor Example
    </title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="srteditor.min.js"></script>
    <script>
      $(document).ready(function () {
        $("#srteditor").srteditor({
          "Submit": function(e) {
            console.log(e.data.doc.body.innerHTML);
          }
        }, "<h3>This is a test</h3>");
      });
    </script>
  </head>
  <body>
    <iframe id="srteditor"></iframe>
  </body>
</html>
```

# Tools

If you want to run the dev tools to help commits you can install [NPM](https://www.npmjs.com) and run 
```sh
bash setup-dev.sh
```

These tools help:
- minify
- lint
