import { AUTO_COMPLETE_ENDPOINT } from './constants/urls';
import AutoComplete from './components/AutoComplete';
import './App.css';


function App() {
  return (
    <div className='wrapper'>
      {/* Importing Autocomplete Component and passing the props, which are required */}
      <AutoComplete
        apiEndpoint={AUTO_COMPLETE_ENDPOINT}
        debounceInterval={300}
        placeHolder={"Enter Name"}
        searchKey={'name'}
        apiResponseDataModifier={(data: any) => {          
          return data.data.docs
        }}
        isAbortPendingRequests={true}
      />
    </div>
  )
}

export default App
