var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const dir = "./submissions/";
var filenames = [];

function testAjax() {
    return $.ajax({
        url: "php/getfilenames.php",
    });
}
var promise = testAjax();
var ogsucname = new Map();
console.log(window.screen.width);
promise.success(function(data) {
    filenames = data.split(',');

    if (!window.location.hash) {
        window.location.href += '#Home';
    }
    if (window.location.hash) {
        if (window.location.hash.indexOf('Home') == 1) {
            ogsucname = makenames();
            console.log(ogsucname);
            makelinks();
        } else {
            var name = window.location.hash;
            name = name.replace("#", "");
            document.getElementsByClassName('Person_Page')[0].innerHTML = name + "'s Page";
            document.getElementsByClassName('Suc_n_OG')[0].childNodes[1].childNodes[1].innerHTML = "";
            document.getElementsByClassName('Suc_n_OG')[0].childNodes[1].childNodes[1].innerHTML = "Completed By " + name;
            document.title = name + "'s submissions";
            for (var i = 0; i < filenames.length; i++) {
                if (filenames[i].toLowerCase().indexOf(name) > -1) {
                    var node = document.createElement("li");
                    var button = document.createElement("button");
                    var pic = document.createElement("img");
                    // pic.loading = "lazy";
                    pic.src = "thumbnails/" + filenames[i];
                    console.log("thumbnails/" + filenames[i]);
                    button.setAttribute('onclick', 'tobig(this)');
                    button.appendChild(pic);
                    node.id = filenames[i];
                    node.appendChild(button);

                    if (filenames[i].split('_')[2] == null) {
                        document.getElementsByClassName('Just_Suc')[0].childNodes[3].appendChild(node);
                    } else if (filenames[i].toLowerCase().split('_')[0] == name) {
                        document.getElementsByClassName('OG_n_Suc')[0].childNodes[3].appendChild(node);
                    } else {
                        document.getElementsByClassName('Suc_n_OG')[0].childNodes[3].appendChild(node);
                    }
                    checkload(document.getElementById(filenames[i]));
                }
            }
            if (document.getElementsByClassName('Just_Suc')[0].childNodes[3].childNodes[1] == null) {
                console.log('test1');
                document.getElementsByClassName('Just_Suc')[0].style.display = 'none';
            }
            if (document.getElementsByClassName('OG_n_Suc')[0].childNodes[3].childNodes[1] == null) {
                console.log('test2');
                document.getElementsByClassName('OG_n_Suc')[0].style.display = 'none';
            }
            if (document.getElementsByClassName('Suc_n_OG')[0].childNodes[3].childNodes[1] == null) {
                console.log('test3');
                document.getElementsByClassName('Suc_n_OG')[0].style.display = 'none';
            }
        }
    }

    function checkload(listitem) {
        var test = document.createElement("div");
        test.className = "loadersmall";
        listitem.appendChild(test);
        listitem.childNodes[0].style.display = 'none';
        listitem.childNodes[1].style.display = 'block';
        listitem.childNodes[0].childNodes[0].addEventListener('load', function() {
            listitem.childNodes[1].style.display = 'none';
            listitem.childNodes[0].style.display = 'block';
            console.log("done");
        });
    }

    function makenames() {
        var originators = [];
        var successors = [];
        for (var i = 0; i < filenames.length; i++) {
            var ogname = filenames[i].slice(0, filenames[i].indexOf("_")).toLowerCase();
            // ogname = ogname.replace(".pn", "");
            if (ogname.lastIndexOf(".") > 0) {
                ogname = ogname.substring(0, ogname.lastIndexOf("."));
            }
            originators.push(ogname);
            var sucname = filenames[i].split('_')[2];
            if (sucname != null) {
                var name = sucname.slice(0, sucname.indexOf("."));
                var lowername = name.toLowerCase();
                successors.push(lowername);
            }
        }
        var originators = [...new Set(originators)];
        console.log(originators);
        var tempmap = new Map();
        for (var i = 0; i < originators.length; i++) {
            var count = successors.reduce(function(n, val) {
                return n + (val === originators[i]);
            }, 0);
            tempmap.set(originators[i], count);
        }
        var contnames = new Map([...tempmap.entries()].sort((a, b) => b[1] - a[1]));
        return contnames;
    }

    function makelinks() {
        for (let [key, value] of ogsucname) {
            var node = document.createElement("li");
            var link = document.createElement("a");
            var textnode = document.createTextNode(key);
            link.href = 'buddypresent.html#' + key;
            link.id = key;
            node.id = key + "listitem";
            link.setAttribute('onclick', "pagegen(this)");
            link.appendChild(textnode);
            node.appendChild(link);
            document.getElementById('buddy_load').appendChild(node);
            const style = document.createElement('style');
            var iconspath = "icons/axe_" + value + ".gif"
            var iditer = "#" + key + "listitem";
            style.textContent = iditer + "::before{content:''; display: flex;flex-direction: row;  height: 30px; width: 30px; background:url(" + iconspath + ") no-repeat; background-size: 30px; position:relative;margin-right: 20px;z-index:0;}";
            document.getElementById(key).append(style);
        }
    };

    function pagegen(obj) {
        window.location.href = 'buddypresent.html#' + obj.id;
    }
});

function getimglist() {
    var promise = new Promise(function(resolve, reject) {
        window.setTimeout(function() {
            resolve(document.getElementsByTagName('img'));
        });
    });
    return promise;
}

function closetobig() {
    document.getElementsByClassName('largewindow')[0].scrollTop;
    var bigimageload = document.getElementsByClassName("activate");
    bigimageload[0].style.display = 'none';
}

function tobig(obj) {
    var getpic = obj.children[0].src;
    var bigimageload = document.getElementsByClassName("activate");
    var ogbox = document.getElementsByClassName("ogname");
    var sucbox = document.getElementsByClassName("sucname");
    var getfile = "submissions/" + getpic.substring(getpic.lastIndexOf("/"), getpic.length).replace("/", "");
    var getnames = getpic.substring(getpic.lastIndexOf("."), getpic.lastIndexOf("/")).replace("/", "").toLowerCase();
    var getog = getnames.split('_')[0];
    var getsuc = getnames.split('_')[2];
    makenamelink(getog, ogbox[0]);
    makenamelink(getsuc, sucbox[0]);
    var getimageframe = document.getElementsByClassName("largeimageload");
    var pic = document.createElement("img");
    getimageframe[0].innerHTML = "";
    pic.src = getfile;
    bigimageload[0].style.display = 'block';
    getimageframe[0].appendChild(pic);
    $(".largewindow").scrollTop(0)
    checkBigload(getimageframe[0]);
}

function checkBigload(item) {
    var test = document.createElement("div");
    test.className = "loadersmall";
    item.appendChild(test);
    item.childNodes[0].style.display = 'none';
    item.childNodes[1].style.display = 'block';
    item.childNodes[0].addEventListener('load', function() {
        item.childNodes[1].style.display = 'none';
        item.childNodes[0].style.display = 'block';
        console.log("done");
    });
}

function makenamelink(name, box) {
    box.innerHTML = "";
    if (name != null) {
        var para = document.createElement("p");
        var paranode = document.createTextNode(name);
        box.innerHTML = name;
        box.parentNode.id = name;
        box.parentNode.setAttribute('onclick', "pageredirect(this)");
    }
}

function pageredirect(obj) {
    window.location.href = 'buddypresent.html#' + obj.id;
    window.onhashchange = function() {
        window.location.reload(true);
    }
}

function reloadpage() {
    // window.location.reload(false);
    window.location.reload(true)
}

function gohome() {
    window.location.href = './';
    // window.location.href += "#Home";
}
// $(document).ready(function(){
//   var imagesloaded = 0;
//   var totalImage = $('img').length;
//   // console.log(totalImage);
//   $('img').each(function(idx,img){
//     $('<img>').on('load',imagesloaded).attr('src',$(img).attr('src'));
//   });
// });
$(window).load(setPage);

function setPage() {
    if (window.location.hash) {
        if (window.location.hash.indexOf('Home') == 1) {
            document.getElementsByClassName('loader')[0].style.visibility = "hidden";
            document.getElementById("buddy_load").style.visibility = "visible";
        } else {
            document.getElementsByClassName('loader')[0].style.visibility = "hidden";
            document.getElementsByClassName("ContestantContent")[0].style.display = "block";
        }
    }
    document.getElementsByClassName("Hakim")[0].style.display = "block";
}