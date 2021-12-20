-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 20, 2021 at 01:03 AM
-- Server version: 10.3.32-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webprojectmockup_restaurantapp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `category_description` varchar(100) NOT NULL,
  `category_image` text NOT NULL,
  `category_created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `category_description`, `category_image`, `category_created_at`, `category_updated_at`) VALUES
(1, 'Cake slices', 'Cake etc', 'uploads\\1636982843779cakeslice.png', '2021-11-15 13:27:23', '2021-11-15 13:27:23'),
(3, 'Carrot', 'Carrot etc', 'uploads\\1636982862892carrot.png', '2021-11-15 13:27:42', '2021-11-15 13:27:42'),
(5, 'Dessert', 'Dessert etc', 'uploads\\1636982919903dessert.png', '2021-11-15 13:28:39', '2021-11-15 13:28:39'),
(6, 'undefined', 'undefined', 'uploads\\1636982992461dinner.png', '2021-11-15 13:29:52', '2021-11-15 13:29:52'),
(8, 'Pizza', 'Pizza etc', 'uploads\\1636983018946pizza.png', '2021-11-15 13:30:18', '2021-11-15 13:30:18'),
(9, 'Ramen', 'Ramen etc', 'uploads\\1636983032892ramen.png', '2021-11-15 13:30:32', '2021-11-15 13:30:32'),
(50, 'Burgerf', 'Zinger etcf', 'uploads\\1637068419114brand.png', '2021-11-16 13:13:39', '2021-11-16 13:13:39'),
(51, 'Burgerf', 'Zinger etcf', 'uploads\\1637068421047brand.png', '2021-11-16 13:13:41', '2021-11-16 13:13:41'),
(65, 'Burgerf', 'Zinger etcf', 'uploads\\1637068617169brand.png', '2021-11-16 13:16:57', '2021-11-16 13:16:57'),
(66, 'undefined', 'undefined', 'uploads\\1637071358078brand.png', '2021-11-16 14:02:38', '2021-11-16 14:02:38'),
(81, 'farooq', 'a', 'uploads/1637670772841rest3.jfif', '2021-11-23 12:32:54', '2021-11-23 12:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `deal`
--

CREATE TABLE `deal` (
  `deal_id` int(11) NOT NULL,
  `deal_title` varchar(50) NOT NULL,
  `deal_description` varchar(100) NOT NULL,
  `deal_image` text NOT NULL,
  `deal_price` text NOT NULL,
  `deal_items` text NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `deal_created_at` date NOT NULL DEFAULT current_timestamp(),
  `deal_expiry_date` text NOT NULL,
  `deal_status` smallint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_description` text NOT NULL,
  `item_image` text DEFAULT NULL,
  `item_estimated_time` text NOT NULL,
  `item_price` varchar(100) DEFAULT NULL,
  `restaurant_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `item_status` smallint(1) NOT NULL DEFAULT 1,
  `item_created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `item_updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`item_id`, `item_name`, `item_description`, `item_image`, `item_estimated_time`, `item_price`, `restaurant_id`, `category_id`, `item_status`, `item_created_at`, `item_updated_at`) VALUES
(1, 'Zinger Burger', 'Crispy burger with mustard sauce', 'uploads\\1637761273455rest4.jpg', '15-20 mins', '200', 14, 2, 0, '2021-10-13 05:45:53', '2021-10-13 05:45:53'),
(2, 'Pizza', 'Test description', 'uploads\\1634103971349pizza.jpg', '10-15 mins', '75', 1, 2, 1, '2021-10-13 05:46:11', '2021-10-13 05:46:11'),
(3, 'Burger', 'Test test', 'uploads\\1637762029047rest4.jpg', '2', '50', 1, 1, 1, '2021-12-15 04:34:56', '2021-11-17 04:36:17'),
(4, 'Test name', 'Item descr', NULL, '2', '60', 1, 1, 1, '2022-01-13 04:34:56', '2021-11-17 04:36:17'),
(6, 'Pizza', 'Test description', 'uploads\\1637747374934rest4.jpg', '10-15 mins', '75', 1, 2, 1, '2021-11-24 09:49:34', '2021-11-24 09:49:34'),
(7, 'Pizza', 'Test description', 'uploads\\1637756193948rest4.jpg', '10-15 mins', '75', 1, 2, 0, '2021-11-24 12:16:33', '2021-11-24 12:16:33');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `assigned_to` int(11) NOT NULL DEFAULT 0,
  `order_remarks` text NOT NULL,
  `order_price` text NOT NULL,
  `order_payment_method` varchar(50) NOT NULL,
  `order_status` int(11) NOT NULL,
  `order_location` text NOT NULL,
  `order_latitude` varchar(100) NOT NULL,
  `order_longitude` varchar(100) NOT NULL,
  `order_is_deleted` int(2) NOT NULL DEFAULT 0,
  `order_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `restaurant_id`, `assigned_to`, `order_remarks`, `order_price`, `order_payment_method`, `order_status`, `order_location`, `order_latitude`, `order_longitude`, `order_is_deleted`, `order_created_at`) VALUES
(13, 4, 1, 0, 'TEST REMARK', '50', '1', 1, 'Q3V7+5W Defence Housing Authority, Karachi, Pakistan', '24.7929953', '67.0648449', 0, '2021-12-15 01:41:01'),
(14, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 03:56:51'),
(15, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 05:33:31'),
(16, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 05:50:19'),
(17, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 06:22:48'),
(18, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 06:44:26'),
(19, 4, 1, 0, 'TEST REMARK', '60', '1', 2, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 06:52:34'),
(20, 4, 1, 0, 'TEST REMARK', '60', '1', 1, '48C Lane 9, Bukhari Commercial Area Phase 6 DHA karachi, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929794', '67.0648294', 0, '2021-12-15 07:17:54'),
(21, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '29 Lane 4, D.H.A Phase 6 Bukhari Commercial Area Phase 6 Defence Housing Authority, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929842', '67.0648958', 0, '2021-12-16 01:08:14'),
(22, 4, 1, 0, 'TEST REMARK', '50', '1', 1, '29 Lane 4, D.H.A Phase 6 Bukhari Commercial Area Phase 6 Defence Housing Authority, Karachi, Karachi City, Sindh 75500, Pakistan', '24.7929842', '67.0648958', 0, '2021-12-16 01:41:15');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `items` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`order_item_id`, `order_id`, `items`) VALUES
(1, 1, '[{\"item_id\":1,\"item_qty\":2},{\"item_id\":2,\"item_qty\":1}]'),
(2, 2, '[{\"item_id\":1,\"item_qty\":2},{\"item_id\":2,\"item_qty\":1}]'),
(3, 3, '[{\"item_id\":1,\"item_qty\":2},{\"item_id\":2,\"item_qty\":1}]'),
(4, 4, '[{\"item_id\":3,\"item_qty\":1}]'),
(5, 5, '[{\"item_id\":3,\"item_qty\":1}]'),
(6, 6, '[{\"item_id\":3,\"item_qty\":1}]'),
(7, 7, '[{\"item_id\":3,\"item_qty\":1}]'),
(8, 8, '[{\"item_id\":3,\"item_qty\":1}]'),
(9, 9, '[{\"item_id\":3,\"item_qty\":1}]'),
(10, 10, '[{\"item_id\":3,\"item_qty\":1}]'),
(11, 11, '[{\"item_id\":3,\"item_qty\":1},{\"item_id\":4,\"item_qty\":1}]'),
(12, 12, '[{\"item_id\":3,\"item_qty\":1}]'),
(13, 13, '[{\"item_id\":3,\"item_qty\":1}]'),
(14, 14, '[{\"item_id\":3,\"item_qty\":1}]'),
(15, 15, '[{\"item_id\":3,\"item_qty\":1}]'),
(16, 16, '[{\"item_id\":3,\"item_qty\":1}]'),
(17, 17, '[{\"item_id\":3,\"item_qty\":1}]'),
(18, 18, '[{\"item_id\":3,\"item_qty\":1}]'),
(19, 19, '[{\"item_id\":4,\"item_qty\":1}]'),
(20, 20, '[{\"item_id\":4,\"item_qty\":1}]'),
(21, 21, '[{\"item_id\":3,\"item_qty\":1}]'),
(22, 22, '[{\"item_id\":3,\"item_qty\":1}]');

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

CREATE TABLE `restaurant` (
  `restaurant_id` int(11) NOT NULL,
  `restaurant_name` varchar(50) NOT NULL,
  `restaurant_subtitle` varchar(100) NOT NULL,
  `restaurant_image` text DEFAULT NULL,
  `restaurant_address` text NOT NULL,
  `restaurant_longitude` varchar(100) DEFAULT NULL,
  `restaurant_latitude` varchar(100) DEFAULT NULL,
  `restaurant_open_time` text NOT NULL,
  `restaurant_close_time` text NOT NULL,
  `restaurant_phone` varchar(20) NOT NULL,
  `restaurant_email` varchar(50) NOT NULL,
  `restaurant_password` text NOT NULL,
  `restaurant_status` smallint(1) NOT NULL,
  `restaurant_created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`restaurant_id`, `restaurant_name`, `restaurant_subtitle`, `restaurant_image`, `restaurant_address`, `restaurant_longitude`, `restaurant_latitude`, `restaurant_open_time`, `restaurant_close_time`, `restaurant_phone`, `restaurant_email`, `restaurant_password`, `restaurant_status`, `restaurant_created_at`) VALUES
(1, 'sasaas', 'Pizza, drinks, fries', 'uploads/1637139878931rest4.jpg', 'KFC - Gulshan-e-Iqbal, Block 7 Gulshan-e-Iqbal, Karachi', '67.0947953', '24.9180588', '9:00 am', '5:00 am', '11223344556', 'farooq.khan@gmail.com', '$2b$10$9AfGVYrReI6/ayVwfaTFkOHV7KkX90LfvHgdfX.8kzJ6.xbwg33Ny', 1, '2021-11-17 09:04:39'),
(7, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637140120119fries.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 't@gmail.com', '$2b$10$i8mpqrIj0fO85qqcQE/AwOx8gKOPbdbfjSE0uodntL0aB1hepJUUG', 1, '2021-11-17 09:08:41'),
(8, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637140197937fries.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'te@gmail.com', '$2b$10$win1h/dWokZuKJpdSle1euXyeO46wuU9ZYrAl.MbYKVyXmidRLo.G', 1, '2021-11-17 09:09:58'),
(9, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637140270862fries.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'a@gmail.com', '$2b$10$OIjMCOH7IkOAf3M2wD0Ck.JF.HqCD7lrTpgB3gTdx.byN/xwk702W', 1, '2021-11-17 09:11:11'),
(10, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637140333794fries.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'aaa@gmail.com', '$2b$10$ShpcUBQbkBh9vryXFMqh7.tdHIrYdbMhOzgIGEhKz4eM8MV4jyoG2', 1, '2021-09-09 09:12:14'),
(19, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637143771613brand.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'cccccccccccccccccc', '$2b$10$KwX5sWtIJighhzjw88MyXeDhTvKLaJB.Y/.fl.WsHM0Ju4U4scW3q', 1, '2021-09-07 10:09:32'),
(20, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637660556892brand.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'aa', '$2b$10$I82jl34tgpFVrP7sWP4tPeGyJ0A1R6yaNC1F02bFkVDQLPiO1TXba', 1, '2021-11-23 09:42:38'),
(21, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637660776952brand.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'farooq@g.com', '$2b$10$xuZjg0NBs7OZ2rWWQ.Hrx.aADlSKP7Ht18scboNxkJ7Ghocgv1YB2', 1, '2021-11-23 09:46:17'),
(22, 'Pizza Hut', 'Pizza, drinks, fries', 'uploads/1637670138261brand.png', 'Defence, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226063', 'farooq@g.co', '$2b$10$4eYVI0whdhVUtEZvl7qMPOnccygFqBaiDK3fkdBmZrS2.9oq.ujgq', 1, '2021-11-23 12:22:18'),
(23, 'Broadway', 'Pizza', 'uploads/1637840766060broadway.jpg', 'Gulshan e Maymar, Karachi', '67.0439875', '24.7981488', '9:00 am', '5:00 am', '03312226066', 'farooq.khan@gmail.c', '$2b$10$FpmPCg.wiXqjG056g2m0e.4xlb45qNTgOQhzL9TwZ2OmtAjiOfyqK', 1, '2021-11-23 12:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_category`
--

CREATE TABLE `restaurant_category` (
  `restaurant_category_id` int(11) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `restaurant_category`
--

INSERT INTO `restaurant_category` (`restaurant_category_id`, `restaurant_id`, `category_id`) VALUES
(7, 1, 1),
(3, 3, 1),
(4, 3, 2),
(8, 6, 1),
(9, 7, 1),
(10, 7, 2),
(11, 8, 1),
(12, 8, 2),
(13, 9, 1),
(14, 9, 2),
(15, 10, 1),
(16, 10, 2),
(17, 11, 1),
(18, 11, 2),
(19, 12, 1),
(20, 12, 2),
(21, 13, 1),
(22, 13, 2),
(6, 14, 1),
(25, 15, 1),
(26, 15, 2),
(27, 16, 1),
(28, 16, 2),
(29, 17, 1),
(30, 17, 2),
(31, 18, 1),
(32, 18, 2),
(33, 19, 1),
(34, 19, 2),
(35, 20, 1),
(36, 20, 2),
(37, 21, 1),
(38, 21, 2),
(39, 22, 1),
(40, 22, 2),
(41, 23, 1);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `review_text` text NOT NULL,
  `rating` float NOT NULL DEFAULT 0,
  `review_created_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `restaurant_id`, `review_text`, `rating`, `review_created_date`) VALUES
(1, 1, 'Zabardast khana hai', 5, '2021-10-11 12:52:49'),
(2, 2, 'Good taste', 4, '2021-10-11 12:53:12');

-- --------------------------------------------------------

--
-- Table structure for table `rider`
--

CREATE TABLE `rider` (
  `rider_id` int(11) NOT NULL,
  `rider_name` varchar(50) NOT NULL,
  `rider_email` varchar(50) NOT NULL,
  `rider_password` text NOT NULL,
  `rider_phone` varchar(20) NOT NULL,
  `rider_address` text NOT NULL DEFAULT 'bufferzone',
  `rider_image` text DEFAULT NULL,
  `rider_license_image` text NOT NULL,
  `rider_cnic_image_front` text NOT NULL,
  `rider_cnic_image_back` text NOT NULL,
  `rider_token` text NOT NULL,
  `rider_status` smallint(11) NOT NULL DEFAULT 0,
  `rider_online` smallint(2) NOT NULL DEFAULT 1,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `rider_created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rider`
--

INSERT INTO `rider` (`rider_id`, `rider_name`, `rider_email`, `rider_password`, `rider_phone`, `rider_address`, `rider_image`, `rider_license_image`, `rider_cnic_image_front`, `rider_cnic_image_back`, `rider_token`, `rider_status`, `rider_online`, `order_id`, `rider_created_at`) VALUES
(2, 'dd', 'dd', '22', '22', 'dd', 'dd', 'dd', 'd', 'd', '', 1, 1, 0, '2021-11-12 12:22:14'),
(7, 'sadsadasd', 'sddd@gfdsf.com', '$2b$10$QOx.mCYKKpOi1wCU1A8/POcAo3IAVMz0QSBNy4NYqYi/ppjKKBERi', '+232113123123', '', '', 'uploads\\1637565415331image.png', 'uploads\\1637565415651image.png', 'uploads\\1637565415656image.png', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6IisyMzIxMTMxMjMxMjMiLCJpYXQiOjE2Mzc1NjU0MTUsImV4cCI6MTYzNzU2OTAxNX0.Iu_cQkO7adK0gzzGlwKqDXupfU7BISSW-BQC0l7LE1s', 1, 1, 0, '2021-11-22 07:16:55'),
(8, 'M Ahsan', 'ahsanmuneer@gmail.com', '$2b$10$Iv..rkzutAu/e/z2IUgbY.HFK8D3AZkNYozGIsTHPH/evVAV6HAge', '+923352350189', '', '', 'uploads\\1637566001061rn_image_picker_lib_temp_d84c72c0-9cbf-462a-8470-da2e85d060a2.jpg', 'uploads\\1637566001068rn_image_picker_lib_temp_74a82123-9e13-40b2-a869-6b4e5e00c38a.jpg', 'uploads\\1637566001272rn_image_picker_lib_temp_2fcd129f-aaf1-4121-a04b-3aa9663ba1a3.jpg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6Iis5MjMzNTIzNTAxODkiLCJpYXQiOjE2MzkxMjc5MzQsImV4cCI6MTYzOTEzMTUzNH0.bk8TKir2joUT3g6UQg3QkyyhhIqVlEQteTzYA0j6vLI', 1, 1, 0, '2021-11-22 07:26:41'),
(9, 'M Ahsan', 'minhal@gmail.com', '$2b$10$SRRHwbXY7B7QImtQrn6L6OJGC9Tgz61WJPpwHMERpPCrsfID0oek6', '+923312226066', '', '', 'uploads\\1637566611233rn_image_picker_lib_temp_d2d88534-4684-4db6-b64b-2874e6d294cc.jpg', 'uploads\\1637566611237rn_image_picker_lib_temp_5f8af91c-572b-49b4-a217-23a9f744df0d.jpg', 'uploads\\1637566611241rn_image_picker_lib_temp_5b068afe-0c37-44f2-9108-9beef40bd893.jpg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6Iis5MjMzMTIyMjYwNjYiLCJpYXQiOjE2Mzc1NjY2MTEsImV4cCI6MTYzNzU3MDIxMX0.CTyLnOHVqBdPi5OU83WKEwgsQSDrFeBgPvsehYq5QtI', 0, 1, 0, '2021-11-22 07:36:51'),
(10, 'M Ahsan', 'minhal@gmail.com', '$2b$10$hnXPU/Zr6SRmF6ENMDZ0ee2Lq.wiDCQWLbNrMsn2kMpTmYj4KCqmu', '+923312226066', '', '', 'uploads\\1637566630976rn_image_picker_lib_temp_d2d88534-4684-4db6-b64b-2874e6d294cc.jpg', 'uploads\\1637566630978rn_image_picker_lib_temp_5f8af91c-572b-49b4-a217-23a9f744df0d.jpg', 'uploads\\1637566630981rn_image_picker_lib_temp_5b068afe-0c37-44f2-9108-9beef40bd893.jpg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6Iis5MjMzMTIyMjYwNjYiLCJpYXQiOjE2Mzc1NjY2MzEsImV4cCI6MTYzNzU3MDIzMX0.kkwr1MA7JnsafbPahhIuGPQG6R_4AU4xK6rg5Eusrqo', 0, 1, 0, '2021-11-22 07:37:11'),
(11, 'M Ahsan', 'minhal@gmail.com', '$2b$10$NtFDJJ3k2Ihh5AG43zXDsub2zmS8UT4p36MCiD45wq.ygd7nwjy3u', '+923312226066', '', '', 'uploads\\1637566684885rn_image_picker_lib_temp_d2d88534-4684-4db6-b64b-2874e6d294cc.jpg', 'uploads\\1637566684892rn_image_picker_lib_temp_5f8af91c-572b-49b4-a217-23a9f744df0d.jpg', 'uploads\\1637566684898rn_image_picker_lib_temp_5b068afe-0c37-44f2-9108-9beef40bd893.jpg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6Iis5MjMzMTIyMjYwNjYiLCJpYXQiOjE2Mzc1NjY2ODUsImV4cCI6MTYzNzU3MDI4NX0.hbrK9tbRYt3PYjYdt_tWmAqLWl9HKxIx-w--vFBUiyA', 0, 1, 5, '2021-11-22 07:38:05'),
(12, 'sadsadasd', 'das@gfdsf.com', '$2b$10$XeX/nthXxL5d7YNj31Hk4uKtCGgB/9WYViS5Pz8UYmGtuSH.qWFZO', '+232113123122', 'bufferzone', NULL, 'uploads/1639131402750image.png', 'uploads/1639131403201image.png', 'uploads/1639131403425image.png', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6IisyMzIxMTMxMjMxMjIiLCJpYXQiOjE2MzkxMzE0MDMsImV4cCI6MTYzOTEzNTAwM30.ubTyKecKsFL7sshpgqzCUUhzq9xHjEKq0DPx897P23A', 0, 1, 0, '2021-12-10 10:16:43'),
(13, 'ahsan muneer', 'ahsanmuneer81@gmail.com', '$2b$10$oMvn8hd0nI/eJII2iY1sBe9pBXkjipMTUxSx69ggWLbC1aoz7g20q', '+923488300016', 'bufferzone', NULL, 'uploads/1639131632701image.png', 'uploads/1639131633163image.png', 'uploads/1639131633392image.png', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcl9waG9uZSI6Iis5MjM0ODgzMDAwMTYiLCJpYXQiOjE2Mzk2NTg5MTIsImV4cCI6MTYzOTY2MjUxMn0.jYz_E1R-r_2py9dssjjzyBbMVpjp3I3Ap4So-BqzyXw', 1, 1, 0, '2021-12-10 10:20:33');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_password` text NOT NULL,
  `user_phone` varchar(20) NOT NULL,
  `user_address` text NOT NULL,
  `user_image` text NOT NULL,
  `user_token` text NOT NULL,
  `user_status` smallint(11) NOT NULL DEFAULT 0,
  `user_created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_password`, `user_phone`, `user_address`, `user_image`, `user_token`, `user_status`, `user_created_at`) VALUES
(1, '', 'minhalnadeem@gmail.com', '$2b$10$uO/hywmghTxsAFSuP0XCi.Xc8XrsUHM90t.dvelKgVIoh500kpORC', '+923312226066', '', '', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoibWluaGFsbmFkZWVtQGdtYWlsLmNvbSIsImlhdCI6MTYzNzg0ODk4OCwiZXhwIjoxNjM3ODUyNTg4fQ.WnDfYU2jjgm2sVhc2kXNO9WU5efVTO0JKNSb6y9oU4c', 1, '2021-11-17 10:13:21'),
(4, '', 'ahsanmuneer81@gmail.com', '$2b$10$v/Rgr5qYAoTacfxu.OZlR.YidY7di86SVQHyzaJ8Cq.TkgPC2Nfnm', '+923488300016', '', '', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiYWhzYW5tdW5lZXI4MUBnbWFpbC5jb20iLCJpYXQiOjE2Mzk5Nzg2ODIsImV4cCI6MTYzOTk4MjI4Mn0.9iFnM2bvHd3BVazZEo09LqnnJHIkJgRHLwn272T7ojg', 0, '2021-11-11 10:13:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `deal`
--
ALTER TABLE `deal`
  ADD PRIMARY KEY (`deal_id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`order_item_id`);

--
-- Indexes for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`restaurant_id`);

--
-- Indexes for table `restaurant_category`
--
ALTER TABLE `restaurant_category`
  ADD PRIMARY KEY (`restaurant_category_id`),
  ADD UNIQUE KEY `restaurant_id` (`restaurant_id`,`category_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `rider`
--
ALTER TABLE `rider`
  ADD PRIMARY KEY (`rider_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `deal`
--
ALTER TABLE `deal`
  MODIFY `deal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `restaurant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `restaurant_category`
--
ALTER TABLE `restaurant_category`
  MODIFY `restaurant_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rider`
--
ALTER TABLE `rider`
  MODIFY `rider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
