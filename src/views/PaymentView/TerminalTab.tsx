import Link from "next/link";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { getExchangeRate } from "../../lib/kraken";

import {
  Loader,
  SelectAndConnectWalletButton,
  NumericTextField,
  SelectTextField,
  NumericInput,
} from "components";

import * as anchor from "@project-serum/anchor";

import { SolanaLogo } from "components";
import styles from "./index.module.css";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { bgcolor } from "@mui/system";
import { blueGrey } from "@mui/material/colors";
import { SubdirectoryArrowLeftSharp } from "@mui/icons-material";

export const TerminalTab = () => {
  const [currency, setCurrency] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);

  useEffect(() => {
    getExchangeRate().then((initialRate) => {
      setRate(initialRate);
    }).catch(e => console.error(e.message));
    const timerId = setInterval(async () => {
      const tempRate = await getExchangeRate();
      setRate(tempRate);
    }, 5000);
    return () => clearInterval(timerId);
  }, []);

  // 更新されたrateの反映
  useEffect(() => {
    return () => {};
  }, [rate]);

  // 更新されたcurrencyの反映
  useEffect(() => {
    return () => {};
  }, [currency]);
  
  const onUpdateCurrency = (value: number) => {
    setCurrency(value);
  };

  return (
    <Grid
      container
      spacing={5}
      padding={3}
      justifyContent="center"
      alignItems="top"
      display={"flex"}
    >
      <Grid
        item
        xs={5}
        display="flex"
        justifyContent="center"
        flexDirection={"row"}
      >
        <QrDisplayScreen />
      </Grid>
      <Grid
        item
        xs={4}
        display="flex"
        justifyContent="center"
        flexDirection={"row"}
      >
        <ExecutPaymentScreen onUpdateCurrency={onUpdateCurrency}/>
      </Grid>
      <Grid
        item
        xs={3}
        display="flex"
        justifyContent="center"
        flexDirection={"row"}
      >
        <RateConversionScreen rate={rate} currency={currency}/>
      </Grid>
      <Grid
        item
        xs={5}
        display="flex"
        justifyContent="center"
        flexDirection={"row"}
      >
        <CancelButton />
      </Grid>
      <Grid
        item
        xs={4}
        display="flex"
        justifyContent="center"
        flexDirection={"row"}
      >
        <ExecuteButton />
      </Grid>
      <Grid
        item
        xs={3}
        display="flex"
        justifyContent="center"
        flexDirection={"row"}
      ></Grid>
    </Grid>
  );
};

const QrDisplayScreen = () => {
  return (
    <div className="">
      Please enter the payment amount in Japanese yen and press the execute
      button.
      <br />
      <br />A QR code is displayed here.
    </div>
  );
};

const CancelButton = () => {
  return (
    <div>
      <button
        className="btn btn-primary rounded-half normal-case	px-16"
        onClick={() => {}}
      >
        Cancel
      </button>
    </div>
  );
};

const ExecuteButton = () => {
  return (
    <div>
      <button
        className="btn btn-secondary rounded-half normal-case	px-16"
        onClick={() => {}}
      >
        Execute
      </button>
    </div>
  );
};

type PropsEPS = {
  onUpdateCurrency: (value: number) => void
};
const ExecutPaymentScreen: FC<PropsEPS> = ({onUpdateCurrency}) => {
  return (
    <div className="">
      <NumericInput id="yen-amount" onUpdateCurrency={onUpdateCurrency} />
    </div>
  );
};

const boxStyle = {
  bgcolor: "aliceblue",
  color: "lightgray",
  border: 1,
  borderRadius: 1,
  px: 1,
  boxShadow: 0,
  flex: 0
};

type PropsRCS = {
  rate: number,
  currency: number,
};
const RateConversionScreen: FC<PropsRCS> = ({rate, currency}) => {
  console.log(rate);

  const updateSol = (rate_: number, currency_: number): string => {
    if (rate_ === 0) {
      return "0";
    } else {
      const tempSol = currency_ / rate_;
      const strSol = tempSol.toString();
      const upperLower = strSol.split(".");
      if (upperLower.length !== 2) {
        return strSol;
      } else {
        const result = `${upperLower[0]}.${upperLower[1].substring(0, 6)}`;
        return result;
      }
    }
  }

  const sol = updateSol(rate, currency);
  return (
    <div className="p-5 flex">
      <Stack spacing={1}>
        <div className="font-bold text-gray-600 pt-3">You will receive</div>

        <Box
          sx={boxStyle}
        >
          <Stack
            direction="row"
            justifyContent="left"
            alignItems="left"
            display="flex"
            padding={1}
          >
            <div id="sol-amount" className="font-bold text-xl text-red-700/75">
              {sol}
            </div>
            <div className="pl-2 text-gray-600">SOL</div>
          </Stack>
        </Box>
        <br/>
        <div className="font-bold text-gray-600">Current exchange rate</div>
        <Box
          sx={boxStyle}
        >
        <Stack
          direction="row"
          justifyContent="left"
          alignItems="center"
          display="flex"
          padding={1}
        >
          <div className="pr-2 text-gray-600">1SOL =</div>
          <div id="current-rate" className="font-bold text-blue-700/75 text-xl">
            {rate}
          </div>
          <div className="pl-2 text-gray-600">JPY</div>
        </Stack></Box>
      </Stack>
    </div>
  );
};
