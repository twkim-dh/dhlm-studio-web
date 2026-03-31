/**
 * S&P 500 + Major Global Stocks — Top 500 by market cap
 * Used for generateStaticParams in /markets/[ticker]
 * FMP live data fetched at request time; this is just for SSG path generation
 */
export const TOP_STOCKS = [
  // Mega Cap ($500B+)
  'NVDA','AAPL','MSFT','GOOGL','GOOG','AMZN','META','AVGO','BRK-B','TSLA',
  'TSM','LLY','WMT','JPM','V','UNH','XOM','MA','ORCL','NVO',
  'COST','HD','PG','JNJ','NFLX','BAC','ABBV','CRM','SAP','AMD',
  'CVX','KO','MRK','TMUS','CSCO','PEP','TMO','ACN','LIN','MCD',
  'ABT','WFC','IBM','GE','ADBE','PM','ISRG','NOW','MS','AXP',
  // Large Cap ($100B-$500B)
  'QCOM','GS','DIS','TXN','INTU','CAT','PFE','BKNG','VZ','T',
  'AMGN','RTX','BLK','HON','UNP','LOW','SPGI','NEE','SYK','ELV',
  'MDT','DHR','SCHW','C','ADI','BMY','AMAT','REGN','PLD','GILD',
  'CB','LRCX','MMC','ETN','CME','MDLZ','ADP','PANW','ITW','KLAC',
  'SLB','MU','DE','SNPS','CDNS','CL','PGR','FI','MCK','TJX',
  'ORLY','EOG','ABNB','CSX','FTNT','USB','APH','CARR','HCA','ECL',
  'FCX','TT','MSI','AIG','SRE','EMR','DXCM','PSA','NSC','GM',
  'OXY','WMB','ROP','CTAS','AFL','TDG','AZO','MPC','JCI','TEL',
  'CMI','AEP','NEM','KMB','DHI','D','SPG','HLT','ANET','PCAR',
  'BK','F','PRU','GD','FAST','WELL','KHC','PH','KDP','O',
  // Mid-Large Cap ($50B-$100B)
  'AMP','ALL','LHX','MSCI','MCHP','DOW','IQV','URI','RSG','EA',
  'BKR','ODFL','PCG','CTVA','FANG','IDXX','HES','GIS','VRSK','VMC',
  'MLM','ON','HSY','CPAY','GEHC','KR','IT','ACGL','OTIS','CDW',
  'CBRE','RCL','DD','ED','BIIB','DLR','HIG','YUM','VICI','KEYS',
  'STZ','EXR','EW','EFX','XEL','WEC','ANSS','GWW','AXON','AVB',
  'EBAY','TROW','MTD','PPG','ROK','TSCO','WTW','FITB','CHD','HAL',
  'FTV','DOV','SBAC','RMD','HPQ','WAB','AWK','ETR','VLTO','ES',
  'EQT','IRM','LYV','LUV','BR','LDOS','TYL','STE','CCL','NTAP',
  'PKG','WST','BAX','FICO','DG','DLTR','EQR','ESS','MAA','UDR',
  'ARE','BXP','VTR','CPT','HST','REG','KIM','FRT','SLG','AIZ',
  // Notable Growth/Tech/Meme stocks
  'PLTR','COIN','SNOW','DDOG','CRWD','ZS','NET','MDB','TEAM','TTD',
  'BILL','ROKU','SHOP','SQ','PYPL','SOFI','HOOD','RBLX','U','PINS',
  'SNAP','SPOT','TWLO','OKTA','DOCU','ZM','ASAN','MNDY','HBS','DOCS',
  'IONQ','QBTS','RGTI','RKLB','LUNR','ASTR','SPCE','JOBY','ACHR','LILM',
  'RIVN','LCID','NIO','XPEV','LI','FSR','GOEV','WKHS','RIDE','PSNY',
  'GME','AMC','BB','BBBY','WISH','CLOV','SOFI','OPEN','UPST','AFRM',
  // Crypto-adjacent
  'MSTR','MARA','RIOT','CLSK','BITF','HUT','CIFR','BTBT','IREN','CORZ',
  // International ADRs
  'BABA','JD','PDD','BIDU','NIO','SE','GRAB','CPNG','MELI','NU',
  'ASML','LULU','TM','HMC','SONY','SNE','MFG','SMFG','MUFG','SAN',
  'HSBC','UBS','CS','DB','BCS','ING','BNP','AZN','GSK','NVS',
  'SNY','DEO','RIO','BHP','VALE','SCCO','ABB','SIEGY','ENLAY','RHHBY',
].filter((v, i, a) => a.indexOf(v) === i); // dedupe
