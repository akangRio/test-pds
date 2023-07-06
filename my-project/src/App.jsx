import { useState, useEffect } from "react";
import "./App.css";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    negara: "",
    pelabuhan: "",
    barang1: "",
    barang2: "",
    harga: "",
    tarifBeaMasuk: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const checkWord = async () => {
    const search = form.negara;
    const { data } = await axios.get(
      `https://insw-dev.ilcs.co.id/n/negara?ur_negara=${search}`
    );
    setOptNegara(data.data);
    console.log(optNegara);
  };

  const checkWord2 = async () => {
    const kodenegara = optNegara[0].kd_negara;
    const search = form.pelabuhan;
    const { data } = await axios.get(
      `https://insw-dev.ilcs.co.id/n/pelabuhan?kd_negara=${kodenegara}&ur_pelabuhan=${search}`
    );
    setOptPelabuhan(data.data);
    console.log(optPelabuhan);
  };

  const checkWord3 = async () => {
    const kodebarang = form.barang1;
    const { data } = await axios.get(
      `https://insw-dev.ilcs.co.id/n/barang?hs_code=${kodebarang}`
    );

    const res = await axios.get(
      `https://insw-dev.ilcs.co.id/n/tarif?hs_code=${kodebarang}`
    );

    setBarang(data.data[0].sub_header + " " + data.data[0].uraian_id);
    console.log(res.data);
    setDiskon(res.data.data[0].bm);
  };

  const [optNegara, setOptNegara] = useState([]);
  const [optPelabuhan, setOptPelabuhan] = useState([]);
  const [barang, setBarang] = useState("");
  const [diskon, setDiskon] = useState(0);

  useEffect(() => {
    if (form.negara.length == 3) {
      checkWord();
    }
    if (form.pelabuhan.length == 3) {
      checkWord2();
    }
    if (form.barang1.length == 8) {
      checkWord3();
    }
  }, [form]);

  const tes = (e) => {
    console.log(e.target.value);
  };
  return (
    <>
      <div className="flex justify-center items-center bg-slate-100 min-h-screen flex-col">
        <h1 className="text-2xl font-bold">Form Input Pelabuhan</h1>
        <form
          action=""
          onChange={handleChange}
          className="outline p-2 outline-slate-300"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <label htmlFor="">Negara</label>
              <Autocomplete
                freeSolo
                disableClearable
                options={optNegara?.map((option) => option.ur_negara)}
                className="w-full bg-white"
                onClick={tes}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                      name="negara"
                      onClick={handleChange}
                    />
                  );
                }}
              />
            </div>
            <div className="flex gap-2">
              <label htmlFor="">Pelabuhan</label>
              <Autocomplete
                freeSolo
                disableClearable
                options={optPelabuhan?.map((option) => option.ur_pelabuhan)}
                className="w-full bg-white"
                onClick={tes}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                      name="pelabuhan"
                      onClick={handleChange}
                    />
                  );
                }}
              />
            </div>
            <div className="flex gap-2">
              <label htmlFor="">Barang</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="rounded-sm outline-1 outline-slate-300 outline"
                  name="barang1"
                />
                <textarea
                  name="barang2"
                  id=""
                  cols="30"
                  rows="10"
                  className="rounded-sm outline-1 outline-slate-300 outline"
                  disabled
                  defaultValue={barang}
                ></textarea>
              </div>
            </div>
            <div className="flex gap-2">
              <label htmlFor="">Harga</label>
              <input
                type="text"
                className="rounded-sm outline-1 outline-slate-300 outline"
                name="harga"
              />
            </div>
            <div className="flex gap-2">
              <label htmlFor="">Tarif Bea Masuk</label>
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <input
                    type="text"
                    className="rounded-sm outline-1 outline-slate-300 outline"
                    // name="tarifBeaMasuk"
                    disabled
                    value={diskon}
                    defaultValue={diskon}
                  />
                  %
                </div>
                <input
                  type="text"
                  className="rounded-sm outline-1 outline-slate-300 outline"
                  value={(form.harga * diskon) / 100}
                  disabled
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
