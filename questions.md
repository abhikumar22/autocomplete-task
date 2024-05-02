## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.
In react, by using both component and pure component, we can create a component by which anything can be rendered, but when it comes to performance and optimisations, there are some fundamental differences between them

Regular Component
Pure Component
It’s a regular component, which internally didn't use a ny logic or comparisons for rendering the component
It internally implements, shouldComponent update, which automatically does shallow comparison for the props and states.
If there is any difference then render the component, otherwise skip it




Eg. when it might break the app
import React, { Component, PureComponent } from 'react';

```
class ListItem extends PureComponent {
 render() {
   return <li>{this.props.item.name}</li>;
 }
}


class List extends Component {
 state = {
   items: [
     { id: 1, name: 'Item 1' },
     { id: 2, name: 'Item 2' },
     { id: 3, name: 'Item 3' }
   ]
 };


 componentDidMount() {
   const items = this.state.items;
   items[0].name = 'Updated Item 1';
   this.setState({ items });
 }


 render() {
   return (
     <ul>
       {this.state.items.map(item => (
         <ListItem key={item.id} item={item} />
       ))}
     </ul>
   );
 }
}
export default List;
```

In this example,
The ListItem component is a PureComponent, and the List component is a regular Component. When the list updates in the componentDidMount lifecycle method by modifying the existing array, it mutates the state directly, which doesn't trigger a re-render of the List component.
Since the ListItem components receive the same array reference as props, their PureComponent nature doesn't detect the shallow change, resulting in the list items not being updated in the UI. This might break the App experience


## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?
In React, the context is deeply connected with components, facilitating communication and signalling any necessary updates. For instance, a root component defines the application's theme, and any component within the component tree may or may not be interested in this information, as illustrated in the official context example.

On the other hand, the shouldComponentUpdate lifecycle method in class components serves to short-circuit the re-rendering process of a section of the component tree, including its children. Let's consider an example: if the props or state of a component undergo insignificant modification, as far as the component is concerned, this could inadvertently obstruct the context, gradually weakening your data flow. Consequently, your app might behave unexpectedly.

## 3. Describe 3 ways to pass information from a component to its PARENT.
- Callback Function 
In this approach, the parent will send a callback function to child, and then child will call that function whenever required, which will trigger the callback function of the parent with the data as parameters
```
// Parent Component
import React, { useState } from 'react';
import ChildComponent from './ChildComponent';


function ParentComponent() {
 const [dataFromChild, setDataFromChild] = useState('');


 const handleDataFromChild = (data) => {
   setDataFromChild(data);
 };


 return (
   <div>
     <ChildComponent sendDataToParent={handleDataFromChild} />
     <p>Data received from child: {dataFromChild}</p>
   </div>
 );
}


export default ParentComponent;



// Child component
import React from 'react';


function ChildComponent({ sendDataToParent }) {
 const sendData = () => {
   sendDataToParent('Data from child');
 };


 return (
   <div>
     <button onClick={sendData}>Send Data to Parent</button>
   </div>
 );
}


export default ChildComponent;
```
- React context API can be also used to provide a way to send data without explicitly passing props through every level of the component tree.
```
// ParentContext.js
import React, { createContext, useState } from 'react';
const ParentContext = createContext();
export const ParentProvider = ({ children }) => {
 const [dataFromChild, setDataFromChild] = useState('');
 const handleDataFromChildComponent = (data) => {
   setDataFromChild(data);
 };
 return (
   <ParentContext.Provider value={{ dataFromChild, handleDataFromChildComponent }}>
     {children}
   </ParentContext.Provider>
 );
};
export default ParentContext;


// ParentComponent.js
import React, { useContext } from 'react';
import ChildComponent from './ChildComponent';
import ParentContext from './ParentContext';
function ParentComponent() {
 const { dataFromChild } = useContext(ParentContext);
 return (
   <div>
     <ChildComponent />
     <p>data received from child component: {dataFromChild}</p>
   </div>
 );
}
export default ParentComponent;



// ChildComponent.js
import React, { useContext } from 'react';
import ParentContext from './ParentContext';
function ChildComponent() {
 const { handleDataFromChild } = useContext(ParentContext);
 const sendData = () => {
   handleDataFromChild('Data from child');
 };
 return (
   <div>
     <button onClick={sendData}>Send Data to Parent</button>
   </div>
 );
}
export default ChildComponent;
```




- Using Forward Ref

Using the forwardRefs feature in React, you can forward a ref from a parent component to a child component and then utilise that ref in the child to access its DOM node or component instance. below is an example how you can use forwardRef to send data from a child to its parent:
```
// ParentComponent.js
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';
function ParentComponent() {
 const childRef = useRef(null);
 const handleDataFromChild = (data) => {
   console.log('Data from child:', data);
   // You can handle the data received from the child here
 };
 return (
   <div>
     <ChildComponent ref={childRef} onDataReceived={handleDataFromChild} />
   </div>
 );
}
export default ParentComponent;


// ChildComponent.js
import React, { forwardRef, useImperativeHandle } from 'react';
const ChildComponent = forwardRef((props, ref) => {
 const sendDataToParent = () => {
   const data = 'Data from child';
   props.onDataReceived(data); // Call the function passed from the parent
 };
 // Expose a function to the parent component using useImperativeHandle
 useImperativeHandle(ref, () => ({
   sendDataToParent
 }));
 return (
   <div>
     <button onClick={sendDataToParent}>Send Data to Parent</button>
   </div>
 );
});
export default ChildComponent;
```

When the button is clicked in the child component, sendDataToParent function is called, which in turn invokes the handleDataFromChild function passed from the parent, allowing data to be sent from the child to the parent.


## 4. Give 2 ways to prevent components from re-rendering.
- Use React.memo
By using memo, the component should be rendered only when the props of the component are updated(not when any of the prop of the parent updated will render the child)
```
const Parent = ({propx,propy}) =>{
   const [loader,setLoader] = useState(false);
   return(
       <div>
           <ChildComponent
               prop1
               prop2
               prop3
          />
       </div>
   )
}

const ChildComponent = ({ prop1, prop2, prop3}) =>{
   <div>
       <div>hello</div>
   </div>
}
export default Memo(ChildComponent)
```
By using memo, ChildComponent will only render, when either of  prop1, prop2, prop3 will change.
Not when the propx,propy or internal state(loader) of parent will update
		     
- Optimisation using PureComponent
By using Purecomponent in class component,It is an automatic operation which internally implements shouldComponentUpdate, which automatically does shallow comparison for state and props, and it will re-render the component, when it is differ from earlier state.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.
Fragment is used to wrap multiple items from a component without introducing extra div over it, and can make component light(if there are multiple places it is used).
```
import React from 'react';
const MyComponent = () => {
 return (
   <>
     <h1>Header</h1>
     <p>Message</p>
     <h1>Footer</h1>
   </>
 );
};
export default MyComponent;
```

It could break other styles from the application as let’s say from parent, there are certain div’s which are having some common styles.
And there’s is some component, which will eventually add 4 divs using fragment
, then the style of parent div will automatically be inherited to child as, the child div’s are injected without any guard div. This would possibly one of the that it may break some of the user experience


## 6. Give 3 examples of the HOC pattern.
-  It’s a design pattern in reactjs, in which a function takes a component as argument and returns a new function with added functionality on top of the existing ones. It is very easy to extend a component using the HOC pattern without really changing anything in the component itself.

Here are 3 examples of HOC pattern :-

1. LoadingHoc
The idea is to wrap any component with this and, when the data is fetched or the state of loader is true, then the component will show loading state, otherwise it will render the component itself
```
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
const withLoader = (WrappedComponent) => {
 const withLoader = (props) => {
   const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
     // Fetch data or perform async operation
     // Once data is fetched, isLoading -> false
     setIsLoading(false);
   }, []);
   if (isLoading) {
     return <Loader />;
   }
   return <WrappedComponent {...props} />;
 };
 return withLoader;
};
export default withLoader;

// Usage
import React from 'react';
import withLoader from './withLoader';
const ListPreviewComponent = () => {
 // Dashboard content
};
export default withLoader(ListPreviewComponent);
```


2. withAuth
This HOC component will check in any component if the user is authenticated, then it will forward to the authenticated page, otherwise it will redirect user to the login page
```
import React from 'react';
import { Redirect } from 'react-router-dom';
const withAuth = (WrappedComponent) => {
 const WithAuth = (props) => {
   // some logic to check if the user is authenticated
   const isAuthenticated =
   if (!isAuthenticated) {
     return <Redirect to="/login" />;
   }
   return <WrappedComponent {...props} />;
 };
 return WithAuth;
};
export default withAuth;


// usage
import React from 'react';
import withAuth from './withAuth';
const Homepage = () => {
 // feed page content component
};
export default withAuth(Homepage);
```

3. withStyles
With this hoc, we can add common styles to every component which is wrapped with it.
```
export function withStyles(Component) {
   return (props) => {
     const style = {
       color: "green",
       fontSize: "16px",
       // Merge all other props
       ...props.style,
     };
      return <Component {...props} style={style} />;
   };
 }

// usage

const Text = () => <p style={{  text-decoration: underline; }}>Hello world</p>;
const StyledText = withStyles(Text);


<StyledText>HI</StyledText> -> this will have additional properties which is due to the wrapping of the component
```



## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

- In Promises
Using the catch method, one can typically get any error caused by the promise or promises chaining.
```
fetch('https://example.com/data')
 .then(response => {
   if (!response.ok) {
     throw new Error('Failed to fetch data');
   }
   return response.json();
 })
 .then(data => {
   // successful completion, process the data
 })
 .catch(error => {
   console.error('Error:', error);
 });
```


- Callbacks
With callbacks, error handling often involves passing an additional callback function to handle errors.
whenever error occurs, then call the error callback
```
function fetchData(callback) {
   setTimeout(() => {
     const error = null;
     if (error) {
       callback(error, null);
     } else {
       callback(null, 'Fetch Successfull');
     }
   }, 1000);
 }
  fetchData((error, data) => {
   if (error) {
     console.error('Error::', error);
   } else {
     console.log('Data::', data);
   }
 });
 ```
 
- Async | Await
It is similar to promises but the exceptions handling is more dependent on try catch
```
async function fetchData() {
   try {
     const response = await fetch('https://example.com/data');
     if (!response.ok) {
       throw new Error('Error!! Failed to Fetch');
     }
     const data = await response.json();
   } catch (error) {
   // it will log all the execeptions which will occur within the above try block
     console.error('Error:', error);
   }
 }
```

## 8. How many arguments does setState take and why is it async.
- Object argument
```
this.setState({ count: this.state.counter + 1 });
```
- Function parameter
```
this.setState((prevState, props) => ({ counter: prevState.counter + props.buffer }));
```
prevState will have all the state variables, and the props values also.
This will allow to update the state based on previous values


SetState is asynchronous, to improve performance and having consistent UI updates.
When we call setState in a class component, React schedules an update to the component's state, but it doesn't immediately apply the updates, it queues the state update and batches multiple updates together(later on all the updates will be pushed in one render) to optimise performance. 
Above batching process allows React to perform a single re-render for multiple state updates, reducing the number of re-renders and improving performance and consistent UI. As setstate updates are async, we cannot blindly rely on the states to be updated just after setstate is called. React will process state updates in batches and apply them at an appropriate time. To execute some logic after state update, we need to use the callback given by setstate or the react lifecycle method i.e componentDidMount. This will ensure/guarantee consistent data flow



## 9. List the steps needed to migrate a Class to Function Component.

```
// Example class component
class MyComponent extends React.Component {
   constructor(props) {
       super(props);
       //Set initial state
       this.state = {
           counter: 0,
           name: ""
       }
   }
   onClickHandler(e) {
       // ...
     }
   render() {
     return <p>Hello, {this.props.name}</p>
   }
 }
```


 1. Simply change class to functional component.
 ```
 const MyComponent = () =>{
   onClickHandler(e) {
       // ...
     }
   render() {
     return <p>Hello, {this.props.name}</p>
   }
 };
```

 2. delete render() and change to return only
 ```
 const MyComponent = () =>{
   onClickHandler(e) {
       // ...
     }
     return <p>Hello, {this.props.name}</p>
 };
 ```

 3. identify states, props and this references and migrate initialisation and set part
 ```
 const MyComponent = ({name}) =>{
   const [loader, setLoader] = useState(false);
   onClickHandler(e) {
       // ...
     }
   return <p>Hello, {name}</p>
   };
 ```


4. Identify all class methods and change them into regular functions
```
   const MyComponent = ({name}) =>{
   const [loader, setLoader] = useState(false);
   const onClickHandler=(e)=> {
       // ...
     }
   return <p>Hello, {name}</p>
   };
```

5. Remove constructor and set the initialisation part (migrate from state to useState hook)
```
   // Example class component
   const MyComponent = ({name}) =>{
       const [counter, setCounter] = useState(0);
       const [name, setName] = useState('');
       const onClickHandler=(e)=> {
           // ...
         }
       return <p>Hello, {name}</p>
       };
```
6. Replace lifecycle methods with hooks
   - setState+state -> useState
   - componentDidMount|ComponentWillUnmount|componentDidUpdate -> useEffect(with dependencies arrays)

7. Remove event handler bindings
8. Check context usage within the component and migrate it to useContext hook implementation


## 10.List a few ways styles can be used with components.
1. Using simple css.
```
Simple Css
style.css -> create a new file with styles
.Wrapper{
   margin: 10px;
}


component ->
import './style.css'
<div className="Wrapper"></div>
```


2. Using Scss Preprocessor
There are many benefits, of using scss preprocessor
Common mixins, variables for color codes, resuasibility etc
scss
```
style.scss -> create a new file with styles
.Wrapper{
   margin: 10px;
   .Container{
       width: 100%;
   }
}

component ->
import './style.css'
<div className="Wrapper">
   <div className="Container">
   </div>
</div>
```

3. Styled Components
It is the technique that combine css with javascript, which allow us to write css directly within the javascript code.
		
```
import React from 'react';
import styled from 'styled-components';


// Define a styled button component
const Button = styled.button`
 background-color: ${props => props.primary ? 'green' : 'red'};
 font-size: 16px;
 &:hover {
   background-color: ${props => props.primary ? 'grey' : 'yellow'};
 }
`;

// Use the styled button component
const App = () => {
 return (
   <div>
     <Button primary>Primary Button</Button>
     <Button>Secondary Button</Button>
   </div>
 );
};
export default App;
```


4. Inline Css
```
This is not the recommended way, but one of the techniques to style the component. We can directly inject the css within the style in div
<div style={{backgroundColor: 'red', margin:'10px'}}>
   Hello World
</div>
```


## 11. How to render an HTML string coming from the server.

We can use dangerousllySetInnerHtml, to render the HTML string directly into the dom, which will explicitly tells react that this is not following render cycles and state updates.
It also have security vulnerabilities, so it’s better to use any parser/package like Dompurify which sanitizes/remove malicious html string, so that we can mitigate the attacks by the hackers
import React from 'react';
import DOMPurify from 'dompurify';

```
const HtmlRenderer = ({ htmlString }) => {
 // Sanitize the HTML string
 const sanitizedHtml = DOMPurify.sanitize(htmlString);

 return (
   <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
 );
};

const App = () => {
 // Sample HTML string
 const htmlString = '<h1>Hello, <script>alert("XSS");</script>World!</h1>';
 return (
   <div>
     <h2>Render HTML String Safely</h2>
     <HtmlRenderer htmlString={htmlString} />
   </div>
 );
};
export default App;

```

