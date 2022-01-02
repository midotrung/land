# LAND

Contracts for Decentraland's World.

## Overview

The LAND contract keeps a record of all the land parcels, who their owner is,
and what data is associated with them. The data associated can be an IPFS
identifier, an IPNS url, or a simple HTTPS endpoint with a land description
file.

Check this [doc](https://github.com/decentraland/proposals/blob/master/dsp/dsp-0010/0010.md) for further understanding.

## License

Code released under [the Apache v2.0 license](https://github.com/decentraland/land/blob/master/LICENSE).

## Deploy both LandRegistry and EstateRegistry

  - Create the file `.secret.matictestnet`
  - Run the cmd `npm run deploy-land-estate-matictestnet`


## assign-parcel

  - Create the file `.secret.matictestnet`
  - Check/edit the input params of the below cmd in `package.json` file
    - `--parcels`: the genesis.json file containing the land parcel long/lat
    - `--account`: the deployer account of the Land and Estate contract
    - `--password`: dummy password (not in use)
    - `--owner`: the account that is to be the owner of the assigned parcels

  - Run the cmd `npm run assign-parcel-matictestnet`