"use client";

import React, { useEffect, useState } from "react";

import {
  Box,
  Stack,
  Card,
  Text,
  CardBody,
  Button,
  Tabs,
  TabList,
  Tab,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
} from "@chakra-ui/react";

import { ReactSearchAutocomplete } from "react-search-autocomplete";

import Weather from "../../components/Weather";
import Maps from "../../components/Maps";

import { Img } from "react-image";
import logo from "./Logo.png";
import styles from "./page.module.css";

export default function Home() {
  const [items, setItems] = useState([{}]);
  // const [source, setSource] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [destName, setDestName] = useState("");
  const [sourceCords, setSourceCords] = useState([77.209, 28.6139]);
  const [destCords, setDestCords] = useState([32.532352, 33.234342]);
  const [totalRoutes, setTotalRoutes] = useState([[28.675538, 77.316325]]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0.0);
  const [time, setTime] = useState("");
  const [safeRoutes, setSafeRoutes] = useState([[]]);

  // useEffect(() => {
  //   console.log();
  // }, [lat])

  const getRoutes = async () => {
    try {
      setLoading(true);
      const routes = await fetch(
        `https://gypsy-backend.onrender.com/api/getRoute`,
        {
          method: "POST",
          body: JSON.stringify({
            DeparturePosition: sourceCords,
            DestinationPosition: destCords,
            DepartureTime: `${new Date()}`,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await routes.json();
      console.log(data);
      let cor = [];
      for (let cordinates of data) {
        cor.push(cordinates.route);
      }
      setSafeRoutes(cor);

      console.log(totalRoutes);
      // setTotalRoutes(data[0].route);
      var dist = data[0].distance;
      dist = (dist / 1000).toFixed(1);
      var seconds = data[0].duration;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours === 0) {
        setTime(`${minutes} mins`);
      } else {
        setTime(`${hours}hrs ${minutes}mins`);
      }
      setDistance(dist);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSearch = async (string) => {
    if (string === "") return;
    const response = await fetch(
      `https://gypsy-backend.onrender.com/api/search/?text=${string}&maxResults=3`
    );
    const data = await response.json();
    const newList = [];

    console.log(`For ${string} = ${data.Results.length}`);
    for (
      let resultIndex = 0;
      resultIndex < data.Results.length;
      resultIndex++
    ) {
      newList.push({
        id: resultIndex,
        name: data.Results[resultIndex].Place.Label,
        lat: data.Results[resultIndex].Place.Geometry.Point[1],
        lon: data.Results[resultIndex].Place.Geometry.Point[0],
      });
    }

    console.log(newList);
    setItems(newList);
  };

  const formatResult = (item) => {
    return (
      <>
        <span>{item.name}</span>
      </>
    );
  };
  const setInput = (value) => {
    setSourceCords([value.lon, value.lat]);
    setSourceName(value.name);
  };
  const setOutput = (value) => {
    setDestCords([value.lon, value.lat]);
    setDestName(value.name);
  };

  return (
    <div>
      <div className={styles.sidebar}>
        <div className={styles.center}>
          <Img src={logo} alt="Logo" height={200} width={200} />
        </div>

        <div className={styles.niet_hackathon}>
          <Text fontSize="xs">NIET HACKATHON PREVIEW</Text>
        </div>
        <div className={styles.main_content}>
          <Stack spacing={2}>
            <Tabs
              className={styles.spacing}
              size="sm"
              variant="soft-rounded"
              colorScheme="blue"
            >
              <TabList>
                <Tab _selected={{ color: "white", bg: "blue.600" }}>Car</Tab>
                <Tab _selected={{ color: "white", bg: "blue.600" }}>
                  Two Wheeler
                </Tab>
                <Tab _selected={{ color: "white", bg: "blue.600" }}>Foot</Tab>
              </TabList>
            </Tabs>

            <Stack spacing={2}>
              {/* For Search AutoComplete */}

              <ReactSearchAutocomplete
                className={styles.search_input}
                items={items}
                onSearch={handleOnSearch}
                formatResult={formatResult}
                onSelect={setInput}
              />

              <ReactSearchAutocomplete
                className={styles.pointer}
                items={items}
                onSearch={handleOnSearch}
                formatResult={formatResult}
                onSelect={setOutput}
              />

              <Weather lat={sourceCords[1]} lon={sourceCords[0]} />
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Text className={styles.spacing}>
              <span>Distance: </span>
              <span className="cl-blue bold">{`${distance} Km`}</span>
            </Text>

            <Text>
              <span>Duration: </span>
              <span className="cl-blue bold">{`${time}`}</span>
            </Text>
          </Stack>

          <Stack
            spacing={2}
            direction="row"
            align="baseline"
            className={styles.spacing}
          >
            <Button
              style={{
                width: "100%",
              }}
              colorScheme="blue"
              onClick={getRoutes}
            >
              Search Route
            </Button>
          </Stack>

          <Card className={styles.spacing}>
            <CardBody>
              <Accordion defaultIndex={[0]}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Fuel
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    The average fuel consumption is lower than usual.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Suggested Stops
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      <ul>
                        <li>NIET Greater Noida</li>
                        <li>Pandey's Home (Arcade Gaming)</li>
                        <li>IILM College Greater Noida</li>
                      </ul>
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Road Conditions
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {`Route between ${sourceName} and ${destName} is very good. No
                    traffic is to be expected. Drive faster than normal to reach
                    in optimal time.`}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        </div>
      </div>
      {loading ? (
        <Spinner
          thickness="8px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          className={styles.spinner}
        />
      ) : (
        <Maps
          className={styles.map}
          totalRoutes={totalRoutes}
          safeRoutes={safeRoutes}
          source={[sourceCords[1], sourceCords[0]]}
          destination={[destCords[1], destCords[0]]}
          sourceName={sourceName}
          destName={destName}
        />
      )}
    </div>
  );
}
