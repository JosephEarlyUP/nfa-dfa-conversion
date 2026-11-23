'use client'

import React from "react";
import { ReactFlow, Background, Edge, MarkerType, BaseEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DFA } from '../conversion/types';

interface DFAGraphProps {
    dfa: DFA;
}

function SelfLoopEdge({
    id,
    sourceX,
    sourceY,
    style = {},
    markerEnd,
    label,
    labelStyle,
}: any) {
    //Manually map to box around node (deafult React Flow cannot do self loops for some reason)
    const path = `M ${sourceX + 30} ${sourceY - 25}
    L ${sourceX + 65} ${sourceY - 25}
    L ${sourceX + 65} ${sourceY + 25}
    L ${sourceX + 0} ${sourceY + 25}
    L ${sourceX + 0} ${sourceY + 0}`;

    return (
        <>
            <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
            {label && (
                <text
                    x={sourceX + 72}
                    y={sourceY + 4}
                    style={{ ...labelStyle, textAnchor: 'start' }}
                    fill="#ffffff"
                >
                    {label}
                </text>
            )}
        </>
    );
}

const edgeTypes = {
    selfLoop: SelfLoopEdge,
};

export default function DFAGraph({ dfa }: DFAGraphProps) {
    const radius = 140; //from center circle
    const centerX = 250;
    const centerY = 250;
    const totalStates = dfa.states.length;

    // Load nodes
    const nodes = dfa.states.map((state, index) => {
        const angle = (index / totalStates) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const isStart = (state === dfa.startState);
        const isAccept = dfa.acceptStates.includes(state);

        return {
            id: state,
            data: { label: state },
            position: { x, y },
            style: {
                background: isStart ? '#6fd2ba' : (isAccept ? '#b6cbff' : '#ffffff'),   //Start nodes should appear a shade of green
                borderRadius: '50%',
                height: '60px',
                width: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isAccept ? '0 0 0 3px #b6cbff, 0 0 0 6px #000000, 0 0 0 7px #b6cbff' : 'none',   //Accept nodes should be sorta double circled
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '11px',
            },
        };
    });

    // Format transitions & edges
    const allEdges: Record<string, string[]> = {};
    if (dfa.transitions) {
        Object.entries(dfa.transitions).forEach(([fromState, actions]) => {
            Object.entries(actions).forEach(([action, toState]) => {
                const key = `${fromState}->${toState}`;
                if (!allEdges[key]) {
                    allEdges[key] = [];
                }
                allEdges[key].push(action);
            });
        });
    }

    const edges: Edge[] = Object.entries(allEdges).map(([key, actions], index) => {
        const [fromState, toState] = key.split('->');
        const selfLoop = (fromState === toState);

        return {
            id: `edge-${fromState}-${toState}-${index}`,
            source: fromState,
            target: toState,
            type: selfLoop ? 'selfLoop' : 'default',
            label: actions.join(', '),
            style: {
                stroke: '#ffffff',
                strokeWidth: 2
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#ffffff',
                strokeWidth: 3
            },
            labelStyle: {
                fill: '#ffffff',
                fontWeight: '700',
                fontSize: '12px',
            },
        };
    });

    return (
        <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                edgeTypes={edgeTypes} 
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    );
}