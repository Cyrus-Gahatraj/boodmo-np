"use client";

import { IconSearch } from "@/components/ui/Icons";
import { useEffect, useState } from "react";
import { VehicleSearchModal, VehicleSelection } from "@/components/home/VehicleSearchModal"; 

interface VehicleNode {
	id: string;
	name: string;
}

export function VehicleSearch() {
	const [makers, setMakers] = useState<VehicleNode[]>([]);
	const [lines, setLines] = useState<VehicleNode[]>([]);
	const [models, setModels] = useState<VehicleNode[]>([]);
	const [configs, setConfigs] = useState<VehicleNode[]>([]);

	const [makerId, setMakerId] = useState("");
	const [lineId, setLineId] = useState("");
	const [modelId, setModelId] = useState("");
	const [configId, setConfigId] = useState("");

	const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleSelection | null>(null);

	const selectStyles = "h-10 flex-1 rounded border border-[#c4d8f0] bg-white px-3 text-xs text-[#394b63] focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed";

	function normalize(data: any): VehicleNode[] {
		return data?.data ?? data?.items ?? data ?? [];
	}

	useEffect(() => {
		fetch("/api/boodmo?action=makers")
		.then((r) => r.json())
		.then((data) => {
			setMakers(normalize(data));
		});
	}, []);

	useEffect(() => {
		if (!makerId) return;

		fetch(`/api/boodmo?action=lines&makerId=${makerId}`)
		.then((r) => r.json())
		.then((data) => {
			setLines(normalize(data));
		});
	}, [makerId]);

	useEffect(() => {
		if (!lineId) return;

		fetch(`/api/boodmo?action=models&makerId=${makerId}&lineId=${lineId}`)
		.then((r) => r.json())
		.then((data) => {
			setModels(normalize(data));
		});
	}, [lineId]);

	useEffect(() => {
		if (!modelId) return;

		fetch(`/api/boodmo?action=configs&makerId=${makerId}&lineId=${lineId}&modelId=${modelId}`)
		.then((r) => r.json())
		.then((data) => {
			setConfigs(normalize(data));
		});
	}, [modelId]);

	// 2. Handlers to clear dependent state manually (prevents race conditions)
	const handleMakerChange = (id: string) => {
		setMakerId(id);
		setLineId(""); setModelId(""); setConfigId("");
		setLines([]); setModels([]); setConfigs([]);
	};

	const handleLineChange = (id: string) => {
		setLineId(id);
		setModelId(""); setConfigId("");
		setModels([]); setConfigs([]);
	};

	const handleModelChange = (id: string) => {
		setModelId(id);
		setConfigId("");
		setConfigs([]);
	};
	
	const getName = (list: VehicleNode[], id: string) => list.find(i => i.id === id)?.name || "";

    const handleSearchClick = () => {
        if (!makerId || !lineId || !modelId) return;

        // Construct the selection object
        const selection: VehicleSelection = {
            makerId,
            lineId,
            modelId,
            configId,
            makerName: getName(makers, makerId),
            lineName: getName(lines, lineId),
            modelName: getName(models, modelId),
            configName: configId ? getName(configs, configId) : undefined
        };

        setSelectedVehicle(selection);
        setIsModalOpen(true);
    };

	return (
        <section className="bg-white py-10">
            <div className="boodmo-container mx-auto max-w-6xl px-4">

			<div className="mb-4 flex flex-wrap items-end justify-between gap-4">
				<h2 className="text-3xl font-semibold" style={{ color: "var(--boodmo-blue)" }}>
					Search by <span style={{ color: "var(--boodmo-blue-light)" }}>Vehicle</span>
				</h2>
			<div className="flex flex-wrap items-center gap-2">
			<span className="text-sm text-[var(--boodmo-text-muted)]">Search by number plate</span>
			<input 
			type="text" 
			placeholder="DL1CBA7545" 
			className="h-9 w-36 rounded border border-[var(--boodmo-border)] bg-white px-3 text-sm text-[var(--boodmo-text)]" 
			/>

			<button 
				type="button" 
				className="flex h-9 items-center gap-1.5 rounded px-4 text-sm font-semibold text-white" 
				style={{ background: "#93e5fd" }}
			>

			<IconSearch size={16} />

			</button>

			</div>
			</div>

			<div className="overflow-hidden rounded border shadow-sm" style={{ background: "var(--boodmo-blue)" }}>
				<div className="flex flex-col gap-3 px-4 py-4 md:flex-row">
					
					<select className={selectStyles} value={makerId} onChange={(e) => handleMakerChange(e.target.value)}>
						<option value="">Select Car Maker</option>
						{makers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
					</select>

					<select className={selectStyles} value={lineId} onChange={(e) => handleLineChange(e.target.value)} disabled={!makerId || lines.length === 0}>
						<option value="">Select Model Line</option>
						{lines.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
					</select>

					<select className={selectStyles} value={modelId} onChange={(e) => handleModelChange(e.target.value)} disabled={!lineId || models.length === 0}>
						<option value="">Select Year</option>
						{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
					</select>

					<select className={selectStyles} value={configId} onChange={(e) => setConfigId(e.target.value)} disabled={!modelId || configs.length === 0}>
						<option value="">Select Modification</option>
						{configs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
					</select>

					<button 
						type="button"
						onClick={handleSearchClick}
						className="h-10 rounded px-6 text-xs font-semibold uppercase tracking-wide text-white bg-[var(--boodmo-blue-light)] disabled:bg-[#93e5fd]" 
						disabled={!modelId} 
					>
						Search Parts
					</button>
				</div>
			</div>
            </div>

            {isModalOpen && selectedVehicle && (
                <VehicleSearchModal 
                    vehicle={selectedVehicle} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </section>
    );
}
