
export const downloadFileHTML = item => {
  let text = item.read.join`\r\n`;
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", item.name);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const getMaxLength = files => files.map(i => i.read.length);

export const splitByLines = text =>
  text.split(/\n/g).filter(i => i.length && i != " ");

export const readBlob = (file, callback, opt_startByte, opt_stopByte) => {
  var start = parseInt(opt_startByte) || 0;
  var stop = parseInt(opt_stopByte) || file.size - 1;

  var reader = new FileReader();
  //use file.size if takes too long
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) callback(evt.target.result);
  };

  var blob = file.slice(start, stop + 1);
  reader.readAsText(blob, "UTF-8");
}