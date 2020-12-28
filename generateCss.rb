

def printCss(i)

  text = <<EOF

  .square-#{i} {
    width:  calc(calc(100% - calc(100% / #{i+2})) / #{i});
    height: calc(calc(100% - calc(100% / #{i+2})) / #{i});
    font-size: calc(100%);
    &.footer-square,
    &.header-square {
      height: calc(100% / #{(i+2)*2}) !important;
    }

    &.row-start-square,
    &.row-end-square {
      width: calc(100% / #{(i+2)*2}) !important;
    }  
  }

EOF
  return text


end


2.upto(14) do |i| 
  puts printCss(i)
end