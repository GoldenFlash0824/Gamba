const paypalTransaction = (sequelize, DataTypes) => {
  const PayPalTransaction = sequelize.define("paypalTransaction", {
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return PayPalTransaction;
};

export default paypalTransaction;
