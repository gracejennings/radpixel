import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const VerticalWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const PlotWrapper = styled.div`
    width: 100%;
    margin: 20px 30px 5px 5px;
`;

export const GraphContainer = (props) => {

    const graphs = ['Graph 1', 'Graph 2', 'Graph 3'];

    const plotData = [
        {
            data: [{x: 0, y: 200}, {x: 1, y: 100}, {x: 2, y: 50}, {x: 3, y: 25}, {x: 4, y: 12.5}, {x: 5, y: 6}, {x: 6, y: 3}],
            title: "Declining chart",
        },
        {
            data: [{x: 0, y: 3}, {x: 1, y: 6}, {x: 2, y: 12}, {x: 3, y: 25}, {x: 4, y: 50}, {x: 5, y: 100}, {x: 6, y: 200}],
            title: "Ascending chart",
        },
        {
            data: [{x: 0, y: 50}, {x: 1, y: 6}, {x: 2, y: 100}, {x: 3, y: 12}, {x: 4, y: 3}, {x: 5, y: 200}, {x: 6, y: 25}],
            title: "Roller coaster",
        },
    ];

    return (
        <>
            {
                plotData.map((val, idx) => (
                    <PlotWrapper>
                        <ResponsiveContainer key={idx} width='99%' height={200}>
                            <LineChart data={val.data} >
                                <Line type="monotone" dataKey="y" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                <XAxis dataKey="x" />
                                <YAxis />
                            </LineChart>
                        </ResponsiveContainer>
                        <div>
                            {val.title}
                        </div>
                    </PlotWrapper>
                ))
            }
        </>    
    )
};