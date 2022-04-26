# pages-cms

Demo of a simple CMS in Cloudflare pages

# WP_CLONE

This is the basic component structure of an editor in a CMS such as wordpress.
The component has four interfaces.

1. `/list` posts
2. `/set/[postId]` post (add new and update existing post)
3. `/delete/[postId]`

The `[postId]` is created on the client.

Shared among all components is a set of KV tables

```javascript
const tables = [KVpost, KVimage1, KVimage2];
```

## 1. `/list`

The `/list` interface lists all entries in the first KV-table, with all the metadata, here as json. :

```javascript
export async function onRequest({env: {POSTS}}) {
  const dataWithNameMetadata = await POSTS.listWithMetadata();
  return new Response(JSON.stringify(dataWithNameMetadata), {headers: {"Content-Type": "application/json"}});
}
```

## 2. `/set/[postId]`

The `/add/[postId]` interface receives a `POST` request with data from a `<form>`.
1. It filters out all the files/images stored in the given input.
2. The "normal" text data is simplified with numbers and boolean turned into javascript number, and then saved as json in the first KV table.
3. the extra files/images are saved as files in the second, third, forth etc. table in the sequence they appear in the form.

## 3. `/delete/[postId]`

The `/delete/[postId]` deletes the given postId.

```javascript
export async function onRequest({env: {KVpost, KVimage1, KVimage2}, params: {postId}}) {
  const post = await KVpost.delete(postId);
  const image1 = await KVimage1.delete(postId);
  const image2 = await KVimage2.delete(postId);
  return new Response(JSON.stringify({post, image1, image2}), {headers: {"Content-Type": "application/json"}});
}
```
