# srteditor

**S**imple **R**ich **T**ext editor

[![Pipeline status](https://gitlab.com/joshraphael/srteditor/badges/master/pipeline.svg)](https://gitlab.com/joshraphael/srteditor/commits/master)

Creates a text box that can be used to render rich text and export as html.

This project uses the following packages:
* [jQuery](http://jquery.com) -- Easy JavaScript selectors
* [Font Awesome](https://fontawesome.com) -- CSS icons


Add an `iframe` to your html and create a selector to load the srteditor when the document is read

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"></meta>
    <title>
      SRTEditor Example
    </title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="srteditor.min.js"></script>
    <script>
      $(document).ready(function () {
        $("#srteditor").srteditor();
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
