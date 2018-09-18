# js-classnamer
A classname extension for uniform and stateful classNames between components

## Installation
```
npm install --save js-classnamer
```
or
```
yarn add js-classnamer
```

## Usage

Default export is a curried function that returns a composed className string for components and their children.

Type | Name | Description
-----|------|------------
**ComponentName** | Array[String] | Array of strings, each will be prefixed as the root of a composed className
**ChildName** | String | Element specific name, appends to each of the given prefixes
**StateNames** (optional) | Object | class name keys, with truthy values will be added to the resulting className. This is in addition to the `ComponentName-ChildName` className


## Examples
```javascript
import jsClassnamer from 'js-classnamer'

console.log(jsClassnamer(['ComponentName'], ''))
// > 'ComponentName'

console.log(jsClassnamer(['ComponentName', 'CustomClassName'], 'actions', { active: true }))
// > 'ComponentName-actions CustomClassName-actions ComponentName-actions-active CustomClassName-actions-active'

console.log(jsClassnamer(['ComponentName'], 'element', {'is-loading': true}))
// > 'ComponentName-element ComponentName-element-is-loading'
```

### It's curried! So set it up once and use the returned function
```javascript
import jsClassnamer from 'js-classnamer'
const getClassName = jsClassnamer(['ComponentName'])
const MyComponent = () => {
  return (
    <section className={getClassName('')}>
      <aside className={getClassName('aside')}>
        <a
          href='#'
          className={getClassName('aside-link', { active: true })}
        >Active Link</a>
        <a
          href='#'
          className={getClassName('aside-link')}
        >Inactive Link</a>
      </aside>
      <article className={getClassName('article')} />
    </section>
  )
}
```
```html
<section class="ComponentName">
  <aside class="ComponentName-aside">
    <a href="#" class="ComponentName-aside-link ComponentName-aside-link-active">Active Link</a>
    <a href="#" class="ComponentName-aside-link">Inactive Link</a>
  </aside>
  <article class="ComponentName-article"></article>
</section>
```

### Match heirarchy of components for composability at any level
```javascript
import jsClassnamer from 'js-classnamer'
const MyComponent = ({ className }) => {
const getClassName = jsClassnamer(['ComponentName', className])
  return (
    <section className={getClassName('')}>
      <aside className={getClassName('aside')}>
        <a
          href='#'
          className={getClassName('aside-link', { active: true })}
        >Active Link</a>
        <a
          href='#'
          className={getClassName('aside-link')}
        >Inactive Link</a>
      </aside>
      <article className={getClassName('article')} />
    </section>
  )
}
```
Parent component:
```javascript
render () {
  const getClassName = jsClassnamer(['Parent'])
  return (
    <div className={getClassName('')}>
      <MyComponent className={getClassName('my-component')} />
    </div>
  )
}
```
Result:
```html
<div class="Parent">
  <section class="ComponentName Parent-my-component">
    <aside class="ComponentName-aside Parent-my-component-aside">
      <a href="#"
        class="
          ComponentName-aside-link
          ComponentName-aside-link-active
          Parent-my-component-aside-link
          Parent-my-component-aside-link-active
        ">Active Link</a>
      <a href="#" class="ComponentName-aside-link Parent-my-component-aside-link">Inactive Link</a>
    </aside>
    <article class="ComponentName-article Parent-my-component-article"></article>
  </section>
</div>
```
Now the parent can specify css specific to the component without adding to the specificity.

### HOC
With a higher order component, you only have to define this pattern once. Now, getClassName shows as a prop in the component and automatically adds the className passed from the parent.

```javascript
import React from 'react'
import classnamer from 'js-classnamer'

export default (name, Component) => {
  Component.displayName = name

  class Wrapper extends React.Component {
    static displayName = `${name}__with_getClassName`

    render () {
      const { className } = this.props
      return <Component getClassName={classnamer([name, className])} {...this.props} />
    }
  }

  return Wrapper
}
```
