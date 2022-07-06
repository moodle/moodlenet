import axios from "axios";
import lib from 'moodlenet-react-app-lib';
import { FC, useEffect, useState } from 'react';

const MainLayout = lib.ui.components.layout.MainLayout
const Index: FC = () => {
  const [urlAuth, setUrlAuth] = useState()

 // const testStr = lib.useTest('iindex').join('---')
  useEffect(() => {
    axios.get('http://localhost:3000/_/moodlenet-gauth/')
      .then((res) => setUrlAuth(res.data))
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  }, [])
  return (
    <MainLayout>
      <h2>B
        Etto ext Page {urlAuth}
      </h2>
      <div className="App">
        {<a href={urlAuth}>
          LOGIN WITH GOOGLE
        </a>}
      </div>
    </MainLayout>
  )
}
export default Index
