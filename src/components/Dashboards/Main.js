import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Service from './Service';
import ServiceMobile from './ServiceMobile';
import ServiceHeader from './ServiceHeader';
import MachineBar from './MachineDetails/MachineBar/MachineBar';
import { API } from "../../utils/API";
import { useParams } from "react-router-dom";
import { useWindowSize } from "../../Hooks";

const Dashboards = () => {
    const windowSize = useWindowSize();
    const { machineName } = useParams();
    const [services, setServices] = useState();

    useEffect(() => {
        API.fetchServicesList({ machineName }).then((response) =>
            setServices(response.data)
        );
    }, [machineName]);

    // pagination

    const servicesPerPage = 5;
    const [activePage, setActivePage] = useState(1);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber)
    };

    // search bar

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const results = services && services.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, services]);

    const indexOfLastService = activePage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = searchResults && searchResults.slice(indexOfFirstService, indexOfLastService);
    const moreResults = searchResults && searchResults.length > servicesPerPage;

    if (windowSize <= 768) {
        return (
            <>
                <div>
                    {currentServices && currentServices.length > 0 ? (
                        currentServices.map((service, index) => {
                            return (
                                <ServiceMobile key={index} service={service} index={index} />
                            )
                        })
                    ) : (
                            <p className="warning-text">No services detected</p>
                        )}
                </div>
                {moreResults && <Pagination
                    activePage={activePage}
                    itemsCountPerPage={servicesPerPage}
                    totalItemsCount={searchResults.length}
                    pageRangeDisplayed={3}
                    onChange={handlePageChange}
                    prevPageText="<"
                    nextPageText=">"
                    firstPageText=".."
                    lastPageText=".."
                />}
            </>
        )
    }

    return (
        <div>
            <div>
                <MachineBar machine="nmv3" address="127.0.01" cpu={30} ram={20} disc="47/210" services="23/98"></MachineBar>

            </div>
            <ServiceHeader setSearchTerm={setSearchTerm} searchTerm={searchTerm} setActivePage={setActivePage} />

            {currentServices && currentServices.length > 0 ? (
                currentServices.map((service, index) => {
                    return (
                        <Service key={index} service={service} index={index} />
                    )
                })
            ) : (
                    <p className="warning-text">No services detected</p>
                )}

            {moreResults && <Pagination
                activePage={activePage}
                itemsCountPerPage={servicesPerPage}
                totalItemsCount={searchResults.length}
                pageRangeDisplayed={3}
                onChange={handlePageChange}
                prevPageText="<"
                nextPageText=">"
                firstPageText=".."
                lastPageText=".."
            />}
        </div>
    );
};

export default Dashboards;
