// temp data
const accountsData = [
    { id: 1, label: "Spencers Checking", balance: 1245 },
    { id: 2, label: "Joint Checking", balance: 1657 },
    { id: 3, label: "Daylas Checking", balance: 954 },
    { id: 4, label: "Joint Savings", balance: 14000 }
  ]
const transactionsData = [
    {
      id: 1, type: "bill", label: "Electric", accountId: 1, date: {
        date: 5,
        months: 7,
        years: 2021
      },
      occurrence: "Monthly",
      value: -135
    },
    {
      id: 3, type: "bill", label: "Water", accountId: 1, date: {
        date: 5,
        months: 7,
        years: 2021
      },
      occurrence: "Monthly",
      value: -25
    },
    {
      id: 4, type: "bill", label: "grocery", accountId: 1, date: {
        date: 5,
        months: 7,
        years: 2021
      },
      occurrence: "Monthly",
      value: -160
    },
    {
      id: 2, type: "bill", label: "phone", accountId: 2, date: {
        date: 13,
        months: 7,
        years: 2021
      },
      occurrence: "Monthly",
      value: -35
    }
  ]

  export { accountsData, transactionsData }