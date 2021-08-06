import dayjs from 'dayjs';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ClientViewer from '../src/components/ClientViewer';
import { api } from '../src/services/api';

export default function Home({ firstClients }) {
  const [allClients, setAllClients] = useState(firstClients)
  const [clients, setClients] = useState(firstClients);
  const [showClient, setShowClient] = useState(false);
  const [clientSelected, setClientSelected] = useState([])
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    return filterByName()
  }, [input]);

  useEffect(() => {
    return filterByStatus()
  }, [status]);

  useEffect(() => {
    return filterByStatus()
  }, [allClients]);

  const filterByStatus = () => { 
    let clientsFilted;
    clientsFilted = 
      status == "all"
      ? allClients.filter((client) => {
          const clientNameAndNationality = normalizeString(`${client.name.first} ${client.name.last} ${client.nat}`);
          const inputValue = normalizeString(input);

          const nameCheck = inputValue.length < 1
            ? allClients
            : clientNameAndNationality.includes(inputValue);
          return nameCheck
        })
      : allClients.filter((client) => {
          const clientNameAndNationality = normalizeString(`${client.name.first} ${client.name.last} ${client.nat}`);
          const inputValue = normalizeString(input);
          const clientGender = normalizeString(client.gender);

          const nameCheck = inputValue.length < 1
            ? clientGender == status
            : clientGender == status && clientNameAndNationality.includes(inputValue);
          return nameCheck
        });
  
    setClients(clientsFilted)
  }

  const filterByName = () => {
    let clientsFilted;
    clientsFilted = 
      input.length < 1
      ? allClients.filter((client) => {
          const clientGender = normalizeString(client.gender);

          const statusCheck = status == "all"
            ? allClients
            : clientGender == status;
          return statusCheck
        })
      : allClients.filter((client) => {
          const clientNameAndNationality = normalizeString(`${client.name.first} ${client.name.last} ${client.nat}`);
          const clientGender = normalizeString(client.gender);
          const inputValue = normalizeString(input);
          
          const statusCheck = status == "all"
          ? clientNameAndNationality.includes(inputValue)
          : clientGender == status && clientNameAndNationality.includes(inputValue);
          return statusCheck
        });
  
    setClients(clientsFilted)
  }

  const normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

  const showMeThisClient = async (client) => {
    setClientSelected(client);
    setShowClient(true);
  };

  const closeClientViewer = () => {
    setShowClient(false)
  };

  const getMoreClients = async () => {
    const { data } = await api.get('?results=50&exc=registered,login,cell');
    const newClients = data.results;

    setAllClients([...allClients, ...newClients]);
    setClients([...clients, ...newClients]);
  };
  
  return (
    <div>
      <Head>
        <title>Coodesh Challenge</title>
      </Head>

      <main className="d-flex justify-content-center">
        {showClient &&
          <ClientViewer clientSelected={clientSelected} close={closeClientViewer} />
        }

        <section className="container d-flex flex-column justify-content-center">
          <div className="d-flex">
            <input 
              className="bg-dark text-light col p-2"
              type="text"
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Search by name or nationality"
              value={input}
            />

            <select 
              className="bg-dark text-light col-5 p-2"
              onChange={(event) => setStatus(event.target.value)}
              style={{marginLeft: "8px"}}  
            >
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <table className="table mt-2">
            <thead className="table-dark">
              <tr>
                <th className="col">Name</th>
                <th className="col">Gender</th>
                <th className="col">Birth</th>
                <th className="col">Actions</th>
              </tr>
            </thead>
            
            <tbody>
              {clients.map((client, index) => {
                return (
                  <tr key={index}>
                    <td>{client.name.first} {client.name.last}</td>
                    <td>{client.gender}</td>
                    <td>{dayjs(client.dob.date).format('DD/MM/YYYY')}</td>
                    <td>
                      <button className="btn btn-dark" onClick={() => showMeThisClient(client)}>View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <button className="btn btn-dark mt-2" onClick={getMoreClients}>More</button>
        </section>
      </main>

      <footer className="d-flex text-center">
        Developed by Alex Nicolas
      </footer>
    </div>
  );
}

export const getStaticProps = async () => {
  const { data } = await api.get('?results=50&exc=registered,login,cell')
  const firstClients = data.results

  return {
    props: {
      firstClients
    }
  }
}