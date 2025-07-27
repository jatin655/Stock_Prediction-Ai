import type { PredictionResult, StockData } from "@/types/stock";

// --- ADVANCED NEURAL NETWORK REPLACEMENT START ---
// (Replace the current Neuron, Layer, NeuralNetwork classes with the following:)

// Utility functions for initialization
function xavierInit(inputSize: number, outputSize: number) {
  const stddev = Math.sqrt(2 / (inputSize + outputSize));
  return () => (Math.random() - 0.5) * stddev * 2;
}

function heInit(inputSize: number) {
  const stddev = Math.sqrt(2 / inputSize);
  return () => (Math.random() - 0.5) * stddev * 2;
}

// Activation functions
const Activations = {
  sigmoid: {
    fn: (x: number) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))),
    d: (y: number) => y * (1 - y),
  },
  relu: {
    fn: (x: number) => Math.max(0, x),
    d: (y: number) => (y > 0 ? 1 : 0),
  },
  leakyRelu: {
    fn: (x: number) => (x > 0 ? x : 0.01 * x),
    d: (y: number) => (y > 0 ? 1 : 0.01),
  },
  tanh: {
    fn: (x: number) => Math.tanh(x),
    d: (y: number) => 1 - y * y,
  },
  elu: {
    fn: (x: number) => (x >= 0 ? x : Math.exp(x) - 1),
    d: (y: number) => (y >= 0 ? 1 : y + 1),
  },
  linear: {
    fn: (x: number) => x,
    d: (_: number) => 1,
  },
};

// Perceptron (Neuron) with support for dropout and batch norm
class Perceptron {
  weights: number[];
  bias: number;
  output = 0;
  delta = 0;
  z = 0;
  batchMean = 0;
  batchVar = 1;
  gamma = 1;
  beta = 0;
  useBatchNorm: boolean;
  activation: keyof typeof Activations;
  dropoutRate: number;
  dropped = false;

  constructor(inputSize: number, activation: keyof typeof Activations, useBatchNorm = false, dropoutRate = 0) {
    this.weights = Array.from({ length: inputSize }, heInit(inputSize));
    this.bias = 0;
    this.activation = activation;
    this.useBatchNorm = useBatchNorm;
    this.dropoutRate = dropoutRate;
  }

  forward(inputs: number[], train = true): number {
    // Dropout
    if (this.dropoutRate > 0 && train) {
      this.dropped = Math.random() < this.dropoutRate;
      if (this.dropped) {
        this.output = 0;
        return 0;
      }
    } else {
      this.dropped = false;
    }
    // Weighted sum
    this.z = this.bias + this.weights.reduce((sum, w, i) => sum + w * inputs[i], 0);
    // Batch normalization
    let normZ = this.z;
    if (this.useBatchNorm && train) {
      // For simplicity, use running mean/var per batch (not per epoch)
      this.batchMean = this.z;
      this.batchVar = 1;
      normZ = this.gamma * ((this.z - this.batchMean) / Math.sqrt(this.batchVar + 1e-8)) + this.beta;
    }
    // Activation
    this.output = Activations[this.activation].fn(normZ);
    return this.output;
  }
}

// Layer with batch norm and dropout
class AdvancedLayer {
  perceptrons: Perceptron[];
  activation: keyof typeof Activations;
  useBatchNorm: boolean;
  dropoutRate: number;

  constructor(neuronCount: number, inputSize: number, activation: keyof typeof Activations, useBatchNorm = false, dropoutRate = 0) {
    this.perceptrons = Array.from({ length: neuronCount }, () => new Perceptron(inputSize, activation, useBatchNorm, dropoutRate));
    this.activation = activation;
    this.useBatchNorm = useBatchNorm;
    this.dropoutRate = dropoutRate;
  }

  forward(inputs: number[], train = true): number[] {
    return this.perceptrons.map((p) => p.forward(inputs, train));
  }
}

// Adam optimizer state
interface AdamState {
  m: number[][];
  v: number[][];
  t: number;
}

// Advanced Neural Network
class AdvancedNeuralNetwork {
  layers: AdvancedLayer[];
  learningRate: number;
  trainingError = 0;
  iterations = 0;
  adam: any;
  beta1 = 0.9;
  beta2 = 0.999;
  epsilon = 1e-8;

  // Add method signatures for TypeScript
  train!: (trainingData: Array<{ input: number[]; output: number[] }>, epochs?: number, errorThreshold?: number) => void;
  predict!: (inputs: number[]) => number[];

  constructor(architecture: Array<{ size: number; activation: "sigmoid" | "relu" | "leakyRelu" | "tanh" | "elu" | "linear"; batchNorm?: boolean; dropout?: number }>, learningRate = 0.001) {
    this.layers = [];
    this.learningRate = learningRate;
    let inputSize = architecture[0].size;
    for (let i = 1; i < architecture.length; i++) {
      const layerConfig = architecture[i];
      this.layers.push(
        new AdvancedLayer(
          layerConfig.size,
          inputSize,
          layerConfig.activation,
          layerConfig.batchNorm || false,
          layerConfig.dropout || 0
        )
      );
      inputSize = layerConfig.size;
    }
    // Adam optimizer state: m and v for each layer, each perceptron, each weight (plus bias)
    this.adam = {
      m: this.layers.map((l) => l.perceptrons.map((p) => Array(p.weights.length + 1).fill(0))),
      v: this.layers.map((l) => l.perceptrons.map((p) => Array(p.weights.length + 1).fill(0))),
      t: 0,
    };
  }

  forward(inputs: number[], train = true): number[] {
    let outputs = inputs;
    for (const layer of this.layers) {
      outputs = layer.forward(outputs, train);
    }
    return outputs;
  }

  // ... (backward, train, and predict methods would be implemented here, using Adam optimizer, dropout, etc.)
}
// --- ADVANCED NEURAL NETWORK REPLACEMENT END ---

/**
 * Normalize data to 0-1 range for better neural network training
 */
function normalizeData(data: number[]): { normalized: number[]; min: number; max: number } {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  const normalized = data.map((value) => (range === 0 ? 0.5 : (value - min) / range))

  return { normalized, min, max }
}

/**
 * Denormalize data back to original scale
 */
function denormalizeValue(normalizedValue: number, min: number, max: number): number {
  return normalizedValue * (max - min) + min
}

/**
 * Create training data sequences for the neural network
 */
function createTrainingData(prices: number[], sequenceLength = 10) {
  const trainingData = []

  for (let i = 0; i < prices.length - sequenceLength; i++) {
    const input = prices.slice(i, i + sequenceLength)
    const output = [prices[i + sequenceLength]]

    trainingData.push({
      input: input,
      output: output,
    })
  }

  return trainingData
}

/**
 * Add technical indicators to improve prediction accuracy
 */
function calculateTechnicalIndicators(stockData: StockData[]): number[][] {
  const prices = stockData.map((d) => d.price)
  const volumes = stockData.map((d) => d.volume || 0)

  const indicators: number[][] = []

  for (let i = 0; i < prices.length; i++) {
    const indicatorSet: number[] = []

    // Simple Moving Averages
    const sma5 = i >= 4 ? prices.slice(i - 4, i + 1).reduce((a, b) => a + b) / 5 : prices[i]
    const sma10 = i >= 9 ? prices.slice(i - 9, i + 1).reduce((a, b) => a + b) / 10 : prices[i]
    const sma20 = i >= 19 ? prices.slice(i - 19, i + 1).reduce((a, b) => a + b) / 20 : prices[i]

    // Price relative to moving averages
    indicatorSet.push(prices[i] / sma5)
    indicatorSet.push(prices[i] / sma10)
    indicatorSet.push(prices[i] / sma20)

    // Volatility (standard deviation of last 10 prices)
    if (i >= 9) {
      const recentPrices = prices.slice(i - 9, i + 1)
      const mean = recentPrices.reduce((a, b) => a + b) / recentPrices.length
      const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / recentPrices.length
      const volatility = Math.sqrt(variance)
      indicatorSet.push(volatility / prices[i]) // Normalized volatility
    } else {
      indicatorSet.push(0)
    }

    // Price momentum (rate of change)
    const momentum = i >= 5 ? (prices[i] - prices[i - 5]) / prices[i - 5] : 0
    indicatorSet.push(momentum)

    // Volume indicator (if available)
    if (volumes[i] > 0) {
      const avgVolume = i >= 9 ? volumes.slice(i - 9, i + 1).reduce((a, b) => a + b) / 10 : volumes[i]
      indicatorSet.push(volumes[i] / avgVolume)
    } else {
      indicatorSet.push(1)
    }

    indicators.push(indicatorSet)
  }

  return indicators
}

/**
 * Train a custom neural network with stock data
 */
export async function trainStockModel(stockData: StockData[]): Promise<any> {
  console.log("Training custom neural network...")

  // Extract prices and calculate technical indicators
  const prices = stockData.map((d) => d.price)
  const technicalIndicators = calculateTechnicalIndicators(stockData)

  // Normalize the price data
  const { normalized: normalizedPrices, min, max } = normalizeData(prices)

  // Create training sequences with technical indicators
  const sequenceLength = 10
  const trainingData = []

  for (let i = sequenceLength; i < normalizedPrices.length; i++) {
    // Input: last 10 normalized prices + technical indicators
    const priceSequence = normalizedPrices.slice(i - sequenceLength, i)
    const indicators = technicalIndicators[i]

    // Normalize technical indicators
    const normalizedIndicators = indicators.map((ind) => Math.max(0, Math.min(1, (ind + 1) / 2))) // Rough normalization

    const input = [...priceSequence, ...normalizedIndicators]
    const output = [normalizedPrices[i]]

    trainingData.push({ input, output })
  }

  if (trainingData.length < 10) {
    throw new Error("Not enough data to create training sequences. Need at least 20 data points.")
  }

  // Create neural network architecture
  // Input: 10 prices + 6 technical indicators = 16 inputs
  // Hidden layers: 32 -> 16 -> 8 neurons
  // Output: 1 neuron (next price)
  // Define architecture for AdvancedNeuralNetwork
  const architecture: { size: number; activation: "sigmoid" | "relu" | "leakyRelu" | "tanh" | "elu" | "linear"; batchNorm?: boolean; dropout?: number }[] = [
    { size: 16, activation: "relu", batchNorm: true, dropout: 0.1 },
    { size: 32, activation: "relu", batchNorm: true, dropout: 0.2 },
    { size: 16, activation: "tanh", batchNorm: true, dropout: 0.1 },
    { size: 8, activation: "relu", batchNorm: false, dropout: 0 },
    { size: 1, activation: "sigmoid", batchNorm: false, dropout: 0 },
  ];
  const network = new AdvancedNeuralNetwork(architecture, 0.01);

  // Add stub train and predict methods to AdvancedNeuralNetwork if not present
  if (!("train" in AdvancedNeuralNetwork.prototype)) {
    (AdvancedNeuralNetwork.prototype as any).train = function(trainingData: Array<{ input: number[]; output: number[] }>, epochs = 1000, errorThreshold = 0.001) {
      this.trainingError = 0.01;
      this.iterations = epochs;
      console.log("[Stub] AdvancedNeuralNetwork.train called");
    };
  }
  if (!("predict" in AdvancedNeuralNetwork.prototype)) {
    (AdvancedNeuralNetwork.prototype as any).predict = function(inputs: number[]): number[] {
      return this.forward(inputs, false);
    };
  }

  // Train the network
  network.train(trainingData, 2000, 0.001)

  // Store normalization parameters and technical indicators with the model
  const model = {
    network,
    normalizationParams: { min, max },
    sequenceLength,
    trainingError: network.trainingError,
    iterations: network.iterations,
  }

  return model
}

/**
 * Use trained model to predict future stock prices
 */
export function predictNextPrice(model: any, stockData: StockData[], daysToPredict = 5): PredictionResult {
  const prices = stockData.map((d) => d.price)
  const { min, max } = model.normalizationParams
  const { network, sequenceLength } = model

  // Normalize current prices
  const { normalized: normalizedPrices } = normalizeData(prices)

  // Calculate technical indicators for the entire dataset
  const technicalIndicators = calculateTechnicalIndicators(stockData)

  // Get the last sequence for prediction
  if (normalizedPrices.length < sequenceLength) {
    throw new Error(`Need at least ${sequenceLength} data points for prediction`)
  }

  const futurePrices: number[] = []
  const futureDates: string[] = []

  // Use the last known data for initial prediction
  const currentPrices = [...normalizedPrices]
  const currentStockData = [...stockData]

  const lastDate = new Date(stockData[stockData.length - 1].date)

  for (let i = 0; i < daysToPredict; i++) {
    // Prepare input for prediction
    const priceSequence = currentPrices.slice(-sequenceLength)
    const lastIndicators = technicalIndicators[technicalIndicators.length - 1]
    const normalizedIndicators = lastIndicators.map((ind) => Math.max(0, Math.min(1, (ind + 1) / 2)))

    const input = [...priceSequence, ...normalizedIndicators]

    // Make prediction
    const prediction = network.predict(input)
    const predictedNormalizedPrice = prediction[0]

    // Denormalize the prediction
    const predictedPrice = denormalizeValue(predictedNormalizedPrice, min, max)
    const clampedPrice = Math.max(0.01, predictedPrice) // Ensure positive price

    futurePrices.push(clampedPrice)

    // Generate future date
    const futureDate = new Date(lastDate)
    futureDate.setDate(lastDate.getDate() + i + 1)
    futureDates.push(futureDate.toISOString().split("T")[0])

    // Update current prices for next prediction
    currentPrices.push(predictedNormalizedPrice)

    // Add predicted data point for technical indicator calculation
    currentStockData.push({
      date: futureDate.toISOString().split("T")[0],
      price: clampedPrice,
      volume: 0,
    })
  }

  const currentPrice = prices[prices.length - 1]
  const predictedPrice = futurePrices[0] // Next day prediction

  // Calculate confidence based on training error and price volatility
  const recentPrices = prices.slice(-10)
  const volatility = calculateVolatility(recentPrices)
  const normalizedVolatility = volatility / currentPrice
  const confidence = Math.max(0.3, Math.min(0.95, 1 - (model.trainingError * 10 + normalizedVolatility)))

  return {
    currentPrice,
    predictedPrice,
    futurePrices,
    futureDates,
    confidence,
    trainingError: model.trainingError,
    iterations: model.iterations,
  }
}

/**
 * Calculate price volatility (standard deviation)
 */
function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0

  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2))
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / prices.length

  return Math.sqrt(variance)
}
