function printPost({name: slug, metadata: {title, type}}) {
  return `<li><a class="post_item" type=${type} href=${slug}>${title}</a></li>`;
}

function makeTabMenu(posts) {
  const postTypes = ["video", "episode", "serie", "producer"];
  let res = '<link rel="stylesheet" href="../../style/style.css"><ul id="accordion" class="accordion">';

  for (const postType of postTypes) {
    res += posts.keys.reduce(function (html, post) {
      if (post.metadata?.type === postType) {
        html += printPost(post);
      }
      return html;
    }, ` <li>
              <div class="tab">${postType[0].toUpperCase() + postType.slice(1)}<b class="add_ico">+</b></div>
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


const template = (slug) => `
<script >
const form = document.querySelector("form");




window.makeSlug = function (el) {
  const slug = el.value.toLowerCase().replaceAll(/[^a-z_\\s-]/g, "").replaceAll(/\\s/g, "_");
  el.form.setAttribute("action", \`/set/ \${slug}\`);
}

function makeMetabox(title, element) {
  let res = \`
    <div class="meta_frame">
     <div class="meta_header"><h2 class="meta_title">\${title}</h2></div>
    <div class="meta_input">\${element}</div>
   </div>
    \`;
  return res;
}

const title = (val)=> makeMetabox("Title ", \`<input type="text" name="title" pattern="[a-zA-Z]{1}.*" value='\${val}' onChange="makeSlug(this)">(title must start with a  character)<br>\`);
const shortDescription = (val)=> makeMetabox("Short description",  \`<textarea placeholder="Write several sentences here" type="text" name="short-text" size="30" required>'\${val}'</textarea>\`);
const fullDescription = (val)=> makeMetabox("Full description",    \`<textarea placeholder="Write full description here" class="widefat" rows="10" name="full_text" size="30">\${val}</textarea>\`);
 
[...document.querySelectorAll(".post_item")].map(item => item.addEventListener("click", async function (e) {
   e.preventDefault();
  const slug = this.getAttribute("href");
  const metadata = await (await fetch(\`/post/\${slug}.json\`)).json();
  console.log(metadata)
  const postType = this.getAttribute("type");
  console.log("click");
  if (postType === "video"){
    form.innerHTML = title(metadata.title) + shortDescription(metadata.short_text) + fullDescription(metadata.full_text);
    }
}))
</script>`

export async function onRequest({params: {post_slug}, env}) {

  const json = await env.POSTS.list();

  const html = container + makeTabMenu(json) + form + `</div>` + template(post_slug);


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