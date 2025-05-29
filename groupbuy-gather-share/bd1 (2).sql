-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 29 mai 2025 à 15:13
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bd1`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `adminId` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `accessLevel` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `grouporder`
--

CREATE TABLE `grouporder` (
  `orderId` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `totalAmount` float NOT NULL,
  `supplierId` int(11) NOT NULL,
  `maxGroupSize` int(11) NOT NULL,
  `minGroupSize` int(11) NOT NULL,
  `currentGroupSize` int(11) NOT NULL,
  `deliveryAdrdress` varchar(200) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `deliveryAddress` varchar(200) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `grouporder`
--

INSERT INTO `grouporder` (`orderId`, `status`, `totalAmount`, `supplierId`, `maxGroupSize`, `minGroupSize`, `currentGroupSize`, `deliveryAdrdress`, `userId`, `deliveryAddress`, `image`, `productName`) VALUES
(1, 'ouvert', 1000, 1, 10, 2, 2, NULL, 0, 'Rue de Casablanca', NULL, 'iphone15'),
(2, 'ouvert', 5000, 1, 10, 2, 2, NULL, 0, 'Rue de Casablanca', NULL, 'tablette'),
(3, 'ouvert', 500, 0, 100, 30, 1, NULL, 4, 'rahma', '.', 'camera'),
(4, 'ouvert', 300, 0, 50, 10, 2, NULL, 4, 'hay riad', 'camera canon', 'pc '),
(5, 'ouvert', 10, 0, 10, 5, 1, NULL, 4, 'irfane', 'cle', NULL),
(6, 'ouvert', 10, 0, 10, 5, 1, NULL, 4, 'irfane', 'cle', NULL),
(7, 'ouvert', 500, 0, 50, 5, 1, NULL, 4, 'irfane', '.', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `groupparticipation`
--

CREATE TABLE `groupparticipation` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `joinedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `groupparticipation`
--

INSERT INTO `groupparticipation` (`id`, `orderId`, `userId`, `joinedAt`) VALUES
(1, 1, 4, '2025-05-28 15:30:04'),
(2, 2, 4, '2025-05-28 16:05:59'),
(3, 4, 4, '2025-05-28 20:11:18');

-- --------------------------------------------------------

--
-- Structure de la table `needs`
--

CREATE TABLE `needs` (
  `needId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `needs`
--

INSERT INTO `needs` (`needId`, `userId`, `productName`, `description`, `quantity`, `createdAt`) VALUES
(1, 4, 'camera', 'bien', 1, '2025-05-28 19:35:33');

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `notificationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orderitem`
--

CREATE TABLE `orderitem` (
  `orderItemId` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `orderDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`orderId`, `userId`, `groupId`, `productName`, `amount`, `status`, `orderDate`) VALUES
(1, 1, 1, 'iphone15', 1000.00, 'en cours', '2025-05-28 21:50:54'),
(2, 2, 2, 'tablette', 5000.00, 'en cours', '2025-05-28 21:50:54'),
(3, 3, 3, 'camera', 500.00, 'en cours', '2025-05-28 21:50:54'),
(4, 4, 4, 'pc', 300.00, 'en cours', '2025-05-28 21:50:54'),
(5, 5, 5, 'tele', 10.00, 'en cours', '2025-05-28 21:50:54');

-- --------------------------------------------------------

--
-- Structure de la table `payment`
--

CREATE TABLE `payment` (
  `paymentId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `amount` float NOT NULL,
  `status` varchar(50) DEFAULT 'en attente',
  `paymentDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

CREATE TABLE `product` (
  `productId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `unitPrice` float NOT NULL,
  `stockQuantity` int(11) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL,
  `supplierId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `review`
--

CREATE TABLE `review` (
  `reviewId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `supplierId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `review`
--

INSERT INTO `review` (`reviewId`, `userId`, `supplierId`, `rating`, `comment`, `creationDate`) VALUES
(1, 1, 2, 5, 'Excellent vendeur !', '2025-05-29 07:58:03');

-- --------------------------------------------------------

--
-- Structure de la table `signup`
--

CREATE TABLE `signup` (
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `confirmPassword` varchar(100) NOT NULL,
  `termsAccepted` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `supplier`
--

CREATE TABLE `supplier` (
  `sipplier` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contactEmail` varchar(100) NOT NULL,
  `contactPhone` varchar(20) NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL COMMENT 'identifiant unique',
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `role` varchar(20) DEFAULT 'acheteur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`userId`, `username`, `email`, `password`, `phoneNumber`, `address`, `isActive`, `role`) VALUES
(1, 'amina', 'amina@gmail.com', '$2b$10$W8mUq3A/nh5zXle7XQduzO84OZMoKrYzAJwGV9FSdGJFXSJr.0qQi', '0612345678', 'Rabat', 1, 'acheteur'),
(2, 'testuser', 'testuser@example.com', '$2b$10$EFEpFnom56s4AHieOh4KwedaGfZcNEkgckZXwG3Y8pYqLOVuygRpq', '0612345678', 'Casablanca', 1, 'buyer'),
(3, 'hhhhh', 'hhhhh@gmail.com', '$2b$10$tz0yNRK7Qps5HnxFvkIET.1TpT8AmZeD8XBO/busyl1SjPvYWx84i', '0644444444', 'casablanca', 1, 'buyer'),
(4, 'maroua ', 'marwasmh3@gmail.com', '$2b$10$5hur6h/KEahHMHNntfUmCee8ZscCsCEbRyq/2DWIEDiliHGaH0Mdy', '0612258064', 'hay rahma rue 10', 1, 'buyer'),
(5, 'hiba zer', 'hibahuo@gmail.com', '$2b$10$o/iJS4z6cfEkXjRilyFJXeGRQ5QGRMnh3paaqmAsZU6OKPfNedLEW', '0674819199', 'irfane', 1, 'seller'),
(6, 'sofia', 'sofiaelan@gmail.com', '$2b$10$8dplDnRtREIEECKopATa0.Lv86CI9ty5VmrMlK.OcoXqhJ/EGykBy', '0657790853', 'hay rahma rue 10', 1, 'seller'),
(7, 'lkjsdlkjfs', 'example@gmail.com', '$2b$10$P/o2F7F6JSrU8P6JjNabVep3HJ0hlPN64YEGjnyo9IHeSPJwyxini', '0600000000', 'here', 1, 'seller'),
(8, 'majda majda', 'majda@gmail.com', '$2b$10$EMUB3Eyglpf23P74VljOfON4W4XdlZrKCOYxi2BfNyTFPGi/kzrsK', '0612258064', 'hay rahma rue 10', 1, 'seller'),
(9, 'habiba', 'habiba@gmail.com', '$2b$10$v8FPKqySfgwGn/hR6wA.Nu6gP041T/g6Jn4KFlVZE5AwE1UY.Ky2e', '0612258066', 'hay rahma rue 10', 1, 'buyer'),
(10, 'oumaima', 'oumaima@gmail.com', '$2b$10$66EnTJTc8e0FoKZt8e0Xues1KUklu9U0wTQgDhG5/AFuSjn2QLCbW', '0612345678', 'Casablanca ', 1, 'buyer'),
(11, 'mohamed', 'mohamed1@gmail.com', '$2b$10$EV8cLoAOexERtaYaZXTTjOn36oUo44/P/YAS3pJ4Kgn2K6nY6kBPe', '0600112233', 'casablanca', 1, 'buyer');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `grouporder`
--
ALTER TABLE `grouporder`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `supplierId` (`supplierId`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `groupparticipation`
--
ALTER TABLE `groupparticipation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `needs`
--
ALTER TABLE `needs`
  ADD PRIMARY KEY (`needId`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notificationId`);

--
-- Index pour la table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`orderItemId`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Index pour la table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentId`);

--
-- Index pour la table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productId`),
  ADD KEY `supplierId` (`supplierId`);

--
-- Index pour la table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `supplierId` (`supplierId`);

--
-- Index pour la table `signup`
--
ALTER TABLE `signup`
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`sipplier`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `grouporder`
--
ALTER TABLE `grouporder`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `groupparticipation`
--
ALTER TABLE `groupparticipation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `needs`
--
ALTER TABLE `needs`
  MODIFY `needId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `notificationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `orderItemId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `product`
--
ALTER TABLE `product`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `review`
--
ALTER TABLE `review`
  MODIFY `reviewId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'identifiant unique', AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
