const eventNameFieldstyle = {
  eventCompetitors: {
    margin: '48px auto 0 auto',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-around',

  },

  eventCompetitor: {
    flex: 1,
    whiteSpace: 'nowrap',
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',

    fontWeight: 300,

    "&:nth-child(3)": {

      justifyContent: 'flex-start',

    },

    "&:nth-child(1)": {
      justifyContent: 'flex-end'
    }

  },

  eventCompetitor2: {
    "& span": {
      order: 1,
    }
  },
  eventCompetitorName: {
    fontSize: '2rem',
    lineHeight: '2rem',
  },
  eventName: {
    margin: '48px auto 0 auto',
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: '300'
  },
  eventCompetitorLogo: {
    "& img": {
      width: 'auto',
      height: '48px',
      margin: '0 16px'
    }

  },
  competitorSeparator: {
    fontSize: '32',
    fontWeight: '700',
    margin: '0 8px 0 8px'
  }
}
export default eventNameFieldstyle;
