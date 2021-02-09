import React from 'react';
import styled from 'styled-components';

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

    return (
        <VerticalWrapper>
            {
                graphs.map((val, idx) => (
                    <PlotWrapper key={idx}>
                        {val}
                    </PlotWrapper>
                ))
            }
        </VerticalWrapper>
    )
};