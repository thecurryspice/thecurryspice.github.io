var themeMode = sessionStorage.getItem('themeMode');
// console.log("So this is a new page: " + themeMode);
var style   = document.createElement( 'link' );
style.rel   = 'stylesheet';
style.type  = 'text/css';
style.href  = '/css/' + themeMode + '.css';
document.getElementsByTagName( 'head' )[0].appendChild(style);

function theme() {
    var style   = document.createElement( 'link' );
    var sheet = "/assets/main.css"

    if (sessionStorage.getItem('themeMode') == null || undefined) {
        sheet  = '/css/light.css';
        sessionStorage.setItem('themeMode', 'light');
        //console.log(sessionStorage.getItem('themeMode'));
    }
    else if ( sessionStorage.getItem('themeMode') === 'dark') {
        sheet  = '/css/light.css';
        sessionStorage.setItem('themeMode', 'light');
        //console.log(sessionStorage.getItem('themeMode'));
    }

    else if( sessionStorage.getItem('themeMode') === 'light') {
        sheet  = '/css/dark.css';
        sessionStorage.setItem('themeMode', 'dark');
        //console.log(sessionStorage.getItem('themeMode'));
    }
    style.rel   = 'stylesheet';
    style.type  = 'text/css';
    style.href  = sheet;
    document.getElementsByTagName( 'head' )[0].appendChild( style );

// document.body.style.backgroundColor = sessionStorage.getItem('bg');
// document.body.style.color = sessionStorage.getItem('cc');

}
