import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../styles/TransactionList.css";
import TransactionItem from "./TransactionItem";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function TransactionList() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#004977", "#d02027"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredTransactions =
    selectedCategory === "All"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.category === selectedCategory,
        );
  //console.log(filteredTransactions);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log("Selected Category:", category);
  };

  const calculateCategoryTotals = (transactions) => {
    const totals = transactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    return totals;
  };

  const calculateTotalSpending = (totals) => {
    return Object.values(totals).reduce((acc, amount) => acc + amount, 0);
  };

  useEffect(() => {
    fetch_cat_list();
    fetch_tran_list();
  }, [selectedCategory]);

  const fetch_tran_list = async () => {
    fetch(`http://localhost:8000/api/v1/list`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Transaction list failed to load.");
        }
        return res.json();
      })
      .then((data) => {
        //console.log(data);
        let lists = [];
        data.forEach((transaction) => {
          //console.log(transaction);
          const trimmed_tran = {
            id: transaction.user_id,
            name: transaction.buy_from,
            date: transaction.date,
            time: transaction.time,
            amount: transaction.amount,
            category: transaction.category,
          };
          lists.push(trimmed_tran);
        });
        //transactions = data;
        setTransactions(lists);
        //console.log(lists);
      })
      .catch((error) => {
        console.error("List.js file: ", error);
      });
  };

  const fetch_cat_list = async () => {
    fetch(`http://localhost:8000/api/v1/category_list`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Category list failed to load.");
        }
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        if (data == null)
          setCategories(["Default"]); //TODO:
        else {
          let category_list = [];
          data.forEach((category) => {
            category_list.push(category.name);
          });
          var string_to_remove = "Default";
          category_list = category_list.filter(function (item) {
            return item !== string_to_remove;
          });
          category_list.unshift(string_to_remove);
          setCategories(category_list);
        }
      })
      .catch((error) => {
        console.log("list.js category list: ", error);
      });
  };

  const addCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    } else {
      alert("This category already exists.");
    }
  };

  const dataForPieChart = React.useMemo(() => {
    const categoryTotals = calculateCategoryTotals(transactions);
    const totalSpending = calculateTotalSpending(categoryTotals);

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      percentage: ((amount / totalSpending) * 100).toFixed(2),
    }));
  }, [transactions]);

  const handleShowChart = () => {
    setShowChart(!showChart);
  };

  // console.log(dataForPieChart);

  return (
    <div className="transaction-page">
      <div className="transaction-list">
        {filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            categories={categories}
            addCategory={addCategory}
          />
        ))}
        <Modal
          isOpen={showChart}
          onRequestClose={handleShowChart}
          contentLabel="Transaction Pie Chart"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              width: "65%",
              fontFamily: '"Calibri", sans-serif',
            },
          }}
        >
          <PieChart width={800} height={400}>
            <Pie
              data={dataForPieChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, amount, percentage }) =>
                `${name}: $${amount} (${percentage}%)`
              }
              outerRadius={150}
              fill="#8884d8"
              dataKey="amount"
            >
              {dataForPieChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => ["$" + value, name]} />
            <Legend />
          </PieChart>
        </Modal>
      </div>
      <div className="category-sidebar">
        <button
          className={selectedCategory === "All" ? "active" : ""}
          onClick={() => handleCategoryClick("All")}
        >
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
        <button className="show-chart-button" onClick={handleShowChart}>
          {showChart ? "Hide" : "Show"} Pie Chart
        </button>
      </div>
    </div>
  );
}

export default TransactionList;
