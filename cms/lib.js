function _updateElement(child, data) {
  for (let [prop, value] of Object.entries(data))
    prop === "innerText" ? child[prop] = value :
      prop === "children" ? _updateChildrenList(child, value) :
        /* prop === attr */  child.setAttribute(prop, value);
}

function _updateChildrenList(el, list) {
  for (let i = 0, startLength = el.children.length; i < startLength; i++) {
    list.length <= i ?
      el.lastChild.remove() :
      _updateElement(el.children[i], list[i]);
  }
  for (let i = el.children.length; i < list.length; i++) {
    const child = el.children[0].cloneNode(true);
    el.append(child);
    _updateElement(child, list[i]);
  }
}

function render(state) {
  state instanceof Array ? _updateChildrenList(this.ownerElement, state) : _updateElement(this.ownerElement, state);
  return state;
}

const lastValue = new WeakMap();

function throttle(obj) {
  const prev = lastValue.get(this);
  const current = JSON.stringify(obj);
  if (prev === current)
    return;
  lastValue.set(this, current);
  return obj;
}

function dispatchClone(e, prefix, type = prefix) {
  const c = new e.constructor(type, e);
  return eventLoop.dispatch(c, this.ownerElement), c;
}

async function ffetch(body, _, type = "text", method = "GET") { //fetch_json and fetch_text_POST
  return await (await fetch(this.value, method.toUpperCase() === "POST" ? {method, body} : undefined))[type]();
}

//todo this works differently than the one in the lib. We should update the one in the lib
//todo the lib has a complex lazy detail. This is special. it should be a different function.
//todo it should be a make lazy event.
//todo the question is if the dispatch should look for event and then fallback to detail.
//todo if the thing coming into dispatch is an event, then dispatch it, if the thing is a

//todo if we need to delay the act of making the formData, then we should do so using the default action.
//todo this is enough)
function dispatchDetail(detail, name, type = name) {
  const e = new CustomEvent(type, {detail});
  return eventLoop.dispatch(e, this.ownerElement), e;
}

function elementCallback(e, prefix, method = prefix) {
  return this.ownerElement[method](e), e;
}

function eventProps(e, ...props) {
  for (let p of props)
    e = e[p];
  return e;
}

function logError(e) {
  return console.error(e), e;
}

function prevent(e) {
  return e.preventDefault(), e;
}