import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const VerticalWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const PlotWrapper = styled.div`
    flex-grow: 1;
`;

export const GraphContainer = (props) => {

    const graphs = ['Graph 1', 'Graph 2', 'Graph 3'];

    const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

    return (
        <>
            {
                graphs.map((val, idx) => (
                    <ResponsiveContainer key={idx} width='99%' height={200}>
                        <LineChart data={data} margin={{top: 20, bottom: 5, right: 30, left: 5}}>
                            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                            <XAxis dataKey="name" />
                            <YAxis />
                        </LineChart>
                    </ResponsiveContainer>
                ))
            }
        </>    
    )
};