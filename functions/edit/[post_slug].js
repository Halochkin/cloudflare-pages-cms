// function makeMetabox(title, element) {
//   let res = `
//     <div class="meta_frame">
//      <div class="meta_header"><h2 class="meta_title">${title}</h2></div>
//     <div class="meta_input">
//      ${element}
//     </div>
//    </div>
//     `;
//   return res;
// }


const style = `<style>
* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  background: #2d2c41;
  font-family: 'Open Sans', Arial, Helvetica, Sans-serif, Verdana, Tahoma;
}

ul {
  list-style-type: none;
}

a {
  color: #b63b4d;
  text-decoration: none;
}

/** =======================
 * Contenedor Principal
 ===========================*/
h1 {
  color: #FFF;
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  margin-top: 80px;
}

h1 a {
  color: #c12c42;
  font-size: 16px;
}

.accordion {
  width: 100%;
  max-width: 360px;
  margin: 20px 20px 20px;
  background: #FFF;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.accordion .link {
  cursor: pointer;
  display: block;
  padding: 15px 15px 15px 42px;
  color: #4D4D4D;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid #CCC;
  position: relative;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  transition: all 0.4s ease;
}

.accordion li:last-child .link {
  border-bottom: 0;
}

.accordion li i {
  position: absolute;
  top: 16px;
  left: 12px;
  font-size: 18px;
  color: #595959;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  transition: all 0.4s ease;
}

.accordion li i.fa-chevron-down {
  right: 12px;
  left: auto;
  font-size: 16px;
}

.accordion li.open .link {
  color: #b63b4d;
}

.accordion li.open i {
  color: #b63b4d;
}
.accordion li.open i.fa-chevron-down {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.accordion li.default .submenu {display: block;}
/**
 * Submenu
 -----------------------------*/
.submenu {
  background: #444359;
  font-size: 14px;
}

.submenu li {
  border-bottom: 1px solid #4b4a5e;
}

.submenu a {
  display: block;
  text-decoration: none;
  color: #d9d9d9;
  padding: 12px;
  padding-left: 42px;
  -webkit-transition: all 0.25s ease;
  -o-transition: all 0.25s ease;
  transition: all 0.25s ease;
}

.submenu a:hover {
  background: #b63b4d;
  color: #FFF;
}
</style>`;

function printPost({name: slug, metadata: {title, timestamp}}) {
  return `<li><a href=${slug}>${title}</a></li>`;
}

function makeTabMenu(posts) {
  const postTypes = ["video", "episode", "serie", "producer"];
  let res = '<ul id="accordion" class="accordion">';

  for (const postType of postTypes) {
    res += posts.keys.reduce(function (html, post) {
      if (post.metadata?.type === postType) {
        html += printPost(post);
      }
      return html;
    }, ` <li>
              <div class="link">${postType[0].toUpperCase() + postType.slice(1)}</div>
              <ul class="submenu">`);

    res += `</ul></li>`;
  }
  return res + `</ul>`;
}


const container = `<div id="container">`;

const form = ` 
 <div class="tab-content">
    <h2>Add or update a post</h2>
    <form action="" method="POST" enctype="multipart/form-data"></form>
 </div>`;


function makeMetabox(title, element) {
  let res = `
    <div class="meta_frame">
     <div class="meta_header"><h2 class="meta_title">${title}</h2></div>
    <div class="meta_input">
     ${element}
    </div>
   </div>
    `;
  return res;
}


const template = `<script src="script.js">

console.log("ass");
</script>`

export async function onRequest({params: {post_slug}, env}) {

  const json = await env.POSTS.list();

  const html = style + container + makeTabMenu(json) + form + `</div>` + template;


  // const title = makeMetabox("Title ",
  //   `<input type="text" name="title" pattern="[a-zA-Z]{1}.*" value=${metadata.title}>(title must start with a  character)<br>`);
  //
  // const shortDescription = makeMetabox("Short description",
  //   `<textarea placeholder="Write several sentences here" type="text" name="short_text" size="30" required >${metadata.short_text}</textarea>`);
  //
  // const fullDescription = makeMetabox("Full description",
  //   `<textarea placeholder="Write full description here" class="widefat" rows="10" name="full-text" size="30">${metadata.full_text}</textarea>`);
  //
  // const youtubeUrl = makeMetabox("Youtube url",
  //   `<input type="text" name="youtube_url" size="30" value=${metadata.youtube_url} required />`);
  // if(post_type === "video")

  return new Response(html, {headers: {"Content-Type": "text/html"}});


}