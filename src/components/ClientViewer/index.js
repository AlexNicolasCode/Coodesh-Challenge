import dayjs from "dayjs";
import Image from "next/image"

export default function ClientViewer(props) {
    const client = props.clientSelected;

    return (
        <section className="bg-dark text-light position-absolute mt-5 p-3 shadow z-index3">
            <button className="bg-light float-right text-dark p-2 rounded-circle" onClick={props.close}>X</button>

            <article className="text-center">
                <Image className="rounded-circle" src={client.picture.medium} alt="client photo" width={100} height={100}/>
                <h2>{client.name.first} {client.name.last}</h2>
                <p>{client.id.name} {client.id.value}</p>
            </article>

            <article className="container mt-5">
                <h2>Details</h2>
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th className="col">Email</th>
                            <th className="col">Gender</th>
                            <th className="col">Birth</th>
                            <th className="col">Phone</th>
                            <th className="col">Nationality</th>
                        </tr>
                    </thead>

                    <tbody className="table-light">
                        <tr>
                            <td>{client.email}</td>
                            <td>{client.gender}</td>
                            <td>{dayjs(client.dob.date).format('DD/MM/YYYY')}</td>
                            <td>{client.phone}</td>
                            <td>{client.nat}</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Address</h3>
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th className="col">Country</th>
                            <th className="col">State</th>
                            <th className="col">City</th>
                            <th className="col">Street</th>
                            <th className="col">Postcode</th>
                        </tr>
                    </thead>
                    
                    <tbody className="table-light">
                        <tr>
                            <td>{client.location.country}</td>
                            <td>{client.location.state}</td>
                            <td>{client.location.city}</td>
                            <td>{client.location.street.name}, {client.location.street.number}</td>
                            <td>{client.location.postcode}</td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </section>
    )
}