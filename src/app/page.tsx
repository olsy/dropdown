'use client';

import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/Dropdown';

export default function Home() {
  // const [selected, setSelected] = useState('Raymon D49VSYdJUC');
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://parseapi.back4app.com/classes/Complete_List_Names?limit=100000',
        {
          headers: {
            'X-Parse-Application-Id': 'zsSkPsDYTc2hmphLjjs9hz2Q3EXmnSxUyXnouj1I', // This is the fake app's application id
            'X-Parse-Master-Key': '4LuCXgPPXXO2sU5cXm6WwpwzaKyZpo3Wpj4G4xXK', // This is the fake app's readonly master key
          },
        },
      );
      const res = await response.json(); // Here you have the data that you need
      setData(res.results.map((item: any) => `${item.Name} ${item.objectId}`));
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!data.length ? (
        <div>Loading</div>
      ) : (
        <>
          <select className="mb-4 h-10 w-56">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <Dropdown<string>
            // value={selected}
            data={data}
            // onChange={v => {
            //   console.log('onChange', v);
            //   setSelected(v);
            // }}
            // onFocus={e => console.log('onFocus', e)}
            // onBlur={e => console.log('onBlur', e)}
            // onKeyDown={e => console.log('onKeyDown', e)}
          />
        </>
      )}
    </main>
  );
}
