@font: "Helvetica Neue Medium";
@highlight: #fabb00;

.track {
  line-opacity: 0.8;
  line-color:@highlight;
  line-width:5;
  [zoom > 7]  { line-opacity:0.5; }
  [zoom > 6]  { line-width:10; }
  [zoom > 8]  { line-width:25; }
  [zoom > 10] { line-width:50; }
}

#points[type='start'],
#points[type='end']{
  marker-line-width: 1;
  marker-line-color: #fff;
  marker-fill-opacity: 0.8;
  marker-fill:@highlight;
  marker-width:5;
  marker-allow-overlap:true;
  marker-ignore-placement:true;

  // Label
  ::start[type='start'] {
    text-name: "[name]";
    text-face-name: @font;
    text-fill: #fff;
    text-size: 15;
    [zoom > 6]  { text-size:25; }
    [zoom > 8]  { text-size:50; marker-line-width: 2; }
  }
}

// Start point
#points[type='start'] {
  marker-width:20;
  [zoom > 7]  { marker-fill-opacity:0.5; }
  [zoom > 6]  { marker-width:35; }
  [zoom > 8]  { marker-width:70; marker-line-width: 2; }
  [zoom > 10] { marker-width:100; }
}

// End point
#points[type='end'] {
  [zoom > 7]  { marker-fill-opacity:0.5; }
  [zoom > 6]  { marker-width:10; }
  [zoom > 8]  { marker-width:25; }
  [zoom > 10] { marker-width:60; }
}

