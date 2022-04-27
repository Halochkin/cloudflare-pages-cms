function printPost({name: slug, metadata: {title, timestamp}}) {
  return `
      <li>
        <a href="/post/${slug}.html">${title} (timestamp: ${timestamp})</a>
        <a href="/post/${slug}.json">(as json)</a><br>
        <button onclick="editPost('${slug}')">edit</button><br>
        <a href="/delete/${slug}">delete this post</a>
      </li>`;
}


export async function onRequest({params: {post_type}, env}) {

  const json = await (await POSTS.list()).json();
  const txt = json.keys.map(printPost).join('\n');
  // const text = `<h1>Suka, ${post_type}</h1>`


  return new Response(txt, {headers: {"Content-Type": "text/html"}});
}