import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { Chip, Pagination as MuiPagination, Typography } from '@mui/material'
import { useEarnPools } from 'src/hooks/useEarnPools'
import { CenterBox } from '../base/grid'
import { formatNumber } from 'src/components/utils/format'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'

export default function PoolsGrid() {
  const { poolsData, chainId, protocols, page, pageCount, setSearchParam } = useEarnPools()
  const { handlePoolItemClick } = useAddLiquidity()
  const [sortModel, setSortModel] = useState([])

  useEffect(() => {
    setSearchParam({
      sortBy: sortModel[0]?.field,
      orderBy: sortModel[0]?.sort?.toUpperCase(),
      page: 1
    })
  }, [sortModel])

  const handlePoolRowClick = params => {
    handlePoolItemClick({ ...params.row, chainId })
  }

  const columns = [
    {
      flex: 0.1,
      field: 'protocol',
      minWidth: 100,
      headerName: 'Protocol',
      renderCell: ({ row }) => {
        const protocol = protocols.find(protocol => protocol.id == row.exchange)

        return protocol?.id ? (
          <CenterBox>
            <img
              src={protocol.logo}
              alt={protocol.name}
              className='chain-selector-icon small margin-right margin-xxsmall'
            />
            {protocol.name}
          </CenterBox>
        ) : (
          <Typography>{`${row.exchange}`}</Typography>
        )
      }
    },
    {
      flex: 0.1,
      field: 'pair',
      minWidth: 100,
      headerName: 'Pair',
      renderCell: ({ row }) => (
        <CenterBox>
          <img src={row.tokens[0].logoURI} className='earn-token' alt='main-token' />
          <img src={row.tokens[1].logoURI} className='earn-token' style={{ marginLeft: '-8px' }} alt='pair-token' />

          <Chip label={`${row.feeTier}%`} sx={{ ml: 2 }} />
        </CenterBox>
      )
    },
    {
      flex: 0.1,
      field: 'apr',
      minWidth: 100,
      headerName: 'APR',
      renderCell: ({ row }) => (
        <Typography color={'#00ff99'} textAlign='right'>
          {`${formatNumber(row.apr, 2)}`}%
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'earnFees',
      minWidth: 100,
      headerName: 'Earn Fees',
      renderCell: ({ row }) => <Typography textAlign='right'>{`${formatNumber(row.earnFee, 2)}`}</Typography>
    },
    {
      flex: 0.1,
      field: 'tvl',
      minWidth: 100,
      headerName: 'TVL',
      renderCell: ({ row }) => <Typography textAlign='right'>{`${formatNumber(row.tvl, 2)}`}</Typography>
    },
    {
      flex: 0.1,
      field: 'volume',
      minWidth: 100,
      headerName: 'Volume',
      renderCell: ({ row }) => <Typography textAlign='right'>{`${formatNumber(row.volume, 2)}`}</Typography>
    }
  ]

  const Pagination = () => (
    <MuiPagination
      color='success'
      page={page}
      count={pageCount}
      onChange={(event, value) => {
        setSearchParam({ page: value })
      }}
    />
  )

  return (
    <Box sx={{ width: '100%' }} mt={4}>
      <DataGrid
        autoHeight
        pagination
        rowHeight={62}
        getRowId={row => `${row.address}-${row.feeTier}`}
        rows={poolsData?.pools}
        rowCount={poolsData?.pools?.length ?? 0}
        columns={columns}
        paginationMode='server'
        sortingMode='server'
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        disableRowSelectionOnClick
        slots={{ pagination: Pagination }}
        onRowClick={handlePoolRowClick}
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'transparent'
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'transparent'
          }
        }}
      />
    </Box>
  )
}
