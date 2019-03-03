# srteditor

**S**imple **R**ich **T**ext editor

Creates a text box that can be used to render rich text and export as html.

This project uses the following packages:
* [jQuery](http://jquery.com) -- Easy JavaScript selectors


Add an `iframe` to your html and create a selector to load the srteditor when the document is read

```html
<!doctype html>
<html lang="en">
  <head>
    <title>
      SRTEditor Example
    </title>
    <script src="jquery-3.3.1.min.js"></script>
    <script src="srteditor.js"></script>
    <script> $(document).ready(function () { $("#srteditor").srteditor(); });
    </script>
  </head>
  <body>
    <iframe id="srteditor"></iframe>
  </body>
</html>
```
