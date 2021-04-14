import { Table } from "antd";
import { useEffect, useState } from "react";

export const PixelTable = (props) => {
  const [data, setData] = useState([]);

  const columns = [
    {
      title: "Frame Activation Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Coordinates", // (x,y) with origin at top left
      dataIndex: "coords",
      key: "coords",
    },
  ];

  const formatData = () => {
    const dataAr = [];

    // Object.entries will throw if props is null
    if (props.pixelData) {
      Object.entries(props.pixelData).forEach(([key, value], index) => {
        console.log(`${index}: ${key} = ${value}`);
        for (var i = 0; i < props.pixelData[key].length; ++i) {
          dataAr.push({
            key: i,
            count: key,
            coords: `(${props.pixelData[key][i][0]}, ${props.pixelData[key][i][1]})`,
          });
        }
      });
    }

    setData(dataAr);
  };

  useEffect(() => {
    formatData();
  }, [props.pixelData]);

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      scroll={{ y: 200 }}
      style={{ width: "99%" }}
    />
  );
};
