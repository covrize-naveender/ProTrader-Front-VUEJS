export const sectionConfig = (selected) => {
    // NYSE ARCA: {

    // CBOE BZX: {
    //     limit: 5,
    //     label: 'CBOE_BZX',
    //     onSelected: selected
    // }

    let ExchangeData = {
        ASX: {
            limit: 5,
            label: 'ASX',
            onSelected: selected
        },
        INDX: {
            limit: 5,
            label: 'Indices',
            onSelected: selected
        },
        NASDAQ: {
            limit: 5,
            label: 'Nasdaq',
            onSelected: selected
        },
        NYSE: {
            limit: 5,
            label: 'NYSE',
            onSelected: selected
        },
        "TSX VENTURE NEX": {
            limit: 5,
            label: 'TSX VENTURE NEX',
            onSelected: selected
        },
        "TSX VENTURE": {
            limit: 5,
            label: 'TSX VENTURE',
            onSelected: selected
        },
        "TSX": {
            limit: 5,
            label: 'TSX',
            onSelected: selected
        },
        "NEO": {
            limit: 5,
            label: 'NEO',
            onSelected: selected
        },
        "CSE": {
            limit: 5,
            label: 'CSE',
            onSelected: selected
        },
        FX: {
            limit: 5,
            label: 'FX',
            onSelected: selected
        },
        CME: {
            limit: 5,
            label: 'CME',
            onSelected: selected
        },
        ME: {
            limit: 5,
            label: 'ME',
            onSelected: selected
        },
        LME: {
            limit: 5,
            label: 'LME',
            onSelected: selected
        },
        LPPM: {
            limit: 5,
            label: 'LPPM',
            onSelected: selected
        },
        "NO EXCHANGE": {
            limit: 5,
            label: 'NO EXCHANGE',
            onSelected: selected
        },

    }

    ExchangeData['NYSE ARCA'] = {
        limit: 5,
        label: 'NYSE ARCA',
        onSelected: selected
    }
    ExchangeData['CBOE BZX'] = {
        limit: 5,
        label: 'CBOE BZX',
        onSelected: selected
    }
    ExchangeData['NYSE AMERICAN'] = {
        limit: 5,
        label: 'NYSE AMERICAN',
        onSelected: selected
    }
    return ExchangeData
}