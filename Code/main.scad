lumbertext = "510";
shell = 0;
characterspacing = 1;
scalevalz = 1.3;
fontsize = 30;
xoffset = -1;
echo(totalwidth);

use <Fonts/Artifakt-Element-Bold.otf> ;
fonts = "Artifakt Element:style=Bold";
tm = textmetrics(lumbertext, size = fontsize, font = fonts, spacing = characterspacing);
totalwidth = tm.size[0];
totalheight = tm.size[1];
bigtag = totalwidth > 74 ? true : false;


module textextrude() {
  rotate([180, 0, 0])
  color([1, 0.5, 0.5])
  linear_extrude(height = 0.42) {
    color([1, 0.5, 0.5])
    scale([1, scalevalz, 1])
    text(lumbertext, size = fontsize, font = fonts, spacing = characterspacing, halign="center");

  };

}
//translate([1,-22,0])
//import("300x63.stl");
module main() {
  translate([0, -20, -0.3]) {
    difference() {
      if (bigtag)
        import("STLs/bigtag.stl");
      if (!bigtag)
        import("STLs/smalltag.stl");

      translate([xoffset,tm.descent+ (totalheight * scalevalz - 40) / 2 + (20), 0.7]) {
        textextrude();
      }
    }
  }
}

if (shell == 0) {
  main();
}
if (shell == 1) {
  translate([0, -20, -0.3]) {
      translate([xoffset,tm.descent+ (totalheight * scalevalz - 40) / 2 + (20), 0.7]) {
        textextrude();
      }
    }
}
//103mm wide
//40mm tall
