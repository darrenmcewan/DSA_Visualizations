import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ChevronRight, ChevronDown, BookOpen, Code, Eye } from 'lucide-react';

const SortingAlgorithmsLearning = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(20);
  const [expandedSections, setExpandedSections] = useState({});
  const intervalRef = useRef(null);

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setCurrentStep(0);
    setSteps([]);
  };

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Sorting algorithms with step tracking
  const algorithms = {
    bubble: {
      name: 'Bubble Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      sort: (arr) => {
        const steps = [];
        const n = arr.length;
        let workingArray = [...arr];
        
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            steps.push({
              array: [...workingArray],
              comparing: [j, j + 1],
              swapped: false,
              description: `Comparing elements at positions ${j} and ${j + 1}`
            });
            
            if (workingArray[j] > workingArray[j + 1]) {
              [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
              steps.push({
                array: [...workingArray],
                comparing: [j, j + 1],
                swapped: true,
                description: `Swapped elements at positions ${j} and ${j + 1}`
              });
            }
          }
        }
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapped: false,
          description: 'Array is now sorted!'
        });
        
        return steps;
      },
      code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
    },
    selection: {
      name: 'Selection Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Finds the minimum element and places it at the beginning, then repeats for the remaining array.',
      sort: (arr) => {
        const steps = [];
        const n = arr.length;
        let workingArray = [...arr];
        
        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          
          steps.push({
            array: [...workingArray],
            comparing: [i],
            minIndex: minIdx,
            swapped: false,
            description: `Finding minimum element starting from position ${i}`
          });
          
          for (let j = i + 1; j < n; j++) {
            steps.push({
              array: [...workingArray],
              comparing: [j, minIdx],
              minIndex: minIdx,
              swapped: false,
              description: `Comparing element at position ${j} with current minimum`
            });
            
            if (workingArray[j] < workingArray[minIdx]) {
              minIdx = j;
            }
          }
          
          if (minIdx !== i) {
            [workingArray[i], workingArray[minIdx]] = [workingArray[minIdx], workingArray[i]];
            steps.push({
              array: [...workingArray],
              comparing: [i, minIdx],
              minIndex: minIdx,
              swapped: true,
              description: `Swapped minimum element to position ${i}`
            });
          }
        }
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapped: false,
          description: 'Array is now sorted!'
        });
        
        return steps;
      },
      code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`
    },
    insertion: {
      name: 'Insertion Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Builds the final sorted array one element at a time, inserting each element into its correct position.',
      sort: (arr) => {
        const steps = [];
        const n = arr.length;
        let workingArray = [...arr];
        
        for (let i = 1; i < n; i++) {
          let key = workingArray[i];
          let j = i - 1;
          
          steps.push({
            array: [...workingArray],
            comparing: [i],
            key: key,
            swapped: false,
            description: `Inserting element ${key} into sorted portion`
          });
          
          while (j >= 0 && workingArray[j] > key) {
            steps.push({
              array: [...workingArray],
              comparing: [j, j + 1],
              key: key,
              swapped: false,
              description: `Moving element ${workingArray[j]} to the right`
            });
            
            workingArray[j + 1] = workingArray[j];
            j--;
          }
          
          workingArray[j + 1] = key;
          
          steps.push({
            array: [...workingArray],
            comparing: [j + 1],
            key: key,
            swapped: true,
            description: `Placed element ${key} at position ${j + 1}`
          });
        }
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapped: false,
          description: 'Array is now sorted!'
        });
        
        return steps;
      },
      code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
    },
    quick: {
      name: 'Quick Sort',
      timeComplexity: 'O(n log n) avg, O(n²) worst',
      spaceComplexity: 'O(log n)',
      description: 'Divides the array into partitions around a pivot element, then recursively sorts the partitions.',
      sort: (arr) => {
        const steps = [];
        let workingArray = [...arr];
        
        function quickSort(arr, low = 0, high = arr.length - 1) {
          if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
          }
        }
        
        function partition(arr, low, high) {
          const pivot = arr[high];
          let i = low - 1;
          
          steps.push({
            array: [...arr],
            comparing: [high],
            pivot: high,
            swapped: false,
            description: `Partitioning around pivot ${pivot} at position ${high}`
          });
          
          for (let j = low; j < high; j++) {
            steps.push({
              array: [...arr],
              comparing: [j, high],
              pivot: high,
              swapped: false,
              description: `Comparing ${arr[j]} with pivot ${pivot}`
            });
            
            if (arr[j] < pivot) {
              i++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
              steps.push({
                array: [...arr],
                comparing: [i, j],
                pivot: high,
                swapped: true,
                description: `Swapped ${arr[j]} to left partition`
              });
            }
          }
          
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          steps.push({
            array: [...arr],
            comparing: [i + 1, high],
            pivot: i + 1,
            swapped: true,
            description: `Placed pivot in correct position`
          });
          
          return i + 1;
        }
        
        quickSort(workingArray);
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapped: false,
          description: 'Array is now sorted!'
        });
        
        return steps;
      },
      code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
    },
    merge: {
      name: 'Merge Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description: 'Divides the array into halves, recursively sorts them, then merges the sorted halves.',
      sort: (arr) => {
        const steps = [];
        let workingArray = [...arr];
        
        function mergeSort(arr, start = 0, end = arr.length - 1) {
          if (start < end) {
            const mid = Math.floor((start + end) / 2);
            mergeSort(arr, start, mid);
            mergeSort(arr, mid + 1, end);
            merge(arr, start, mid, end);
          }
        }
        
        function merge(arr, start, mid, end) {
          const left = arr.slice(start, mid + 1);
          const right = arr.slice(mid + 1, end + 1);
          
          steps.push({
            array: [...arr],
            comparing: Array.from({length: end - start + 1}, (_, i) => start + i),
            swapped: false,
            description: `Merging subarrays from ${start} to ${mid} and ${mid + 1} to ${end}`
          });
          
          let i = 0, j = 0, k = start;
          
          while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
              arr[k] = left[i];
              i++;
            } else {
              arr[k] = right[j];
              j++;
            }
            k++;
            
            steps.push({
              array: [...arr],
              comparing: [k - 1],
              swapped: true,
              description: `Placed element in merged array`
            });
          }
          
          while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
          }
          
          while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
          }
        }
        
        mergeSort(workingArray);
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          swapped: false,
          description: 'Array is now sorted!'
        });
        
        return steps;
      },
      code: `function mergeSort(arr, start = 0, end = arr.length - 1) {
  if (start < end) {
    const mid = Math.floor((start + end) / 2);
    mergeSort(arr, start, mid);
    mergeSort(arr, mid + 1, end);
    merge(arr, start, mid, end);
  }
}

function merge(arr, start, mid, end) {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  
  let i = 0, j = 0, k = start;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
  }
  
  while (i < left.length) {
    arr[k] = left[i];
    i++;
    k++;
  }
  
  while (j < right.length) {
    arr[k] = right[j];
    j++;
    k++;
  }
}`
    }
  };

  // Generate steps for selected algorithm
  const generateSteps = () => {
    if (array.length === 0) return;
    const newSteps = algorithms[selectedAlgorithm].sort(array);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  // Play/pause animation
  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      if (steps.length === 0) {
        generateSteps();
      }
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
  };

  // Reset animation
  const reset = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
  };

  // Get current array state
  const getCurrentArray = () => {
    if (steps.length === 0) return array;
    return steps[currentStep]?.array || array;
  };

  // Get current step info
  const getCurrentStepInfo = () => {
    if (steps.length === 0) return null;
    return steps[currentStep];
  };

  // Toggle expanded sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Bar visualization component
  const BarChart = () => {
    const currentArray = getCurrentArray();
    const stepInfo = getCurrentStepInfo();
    const maxValue = Math.max(...currentArray);

    return (
      <div className="h-80 flex items-end justify-center gap-1 p-4 bg-gray-50 rounded-lg">
        {currentArray.map((value, index) => {
          let barColor = 'bg-blue-500';
          
          if (stepInfo) {
            if (stepInfo.comparing && stepInfo.comparing.includes(index)) {
              barColor = stepInfo.swapped ? 'bg-green-500' : 'bg-red-500';
            } else if (stepInfo.pivot === index) {
              barColor = 'bg-purple-500';
            } else if (stepInfo.minIndex === index) {
              barColor = 'bg-orange-500';
            }
          }
          
          return (
            <div
              key={index}
              className={`${barColor} transition-all duration-300 min-w-[2px] rounded-t`}
              style={{
                height: `${(value / maxValue) * 250}px`,
                width: `${Math.max(300 / currentArray.length, 2)}px`
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Data Structures & Algorithms
          </h1>
          <p className="text-xl text-gray-600">
            Interactive Learning Platform
          </p>
        </div>

        {/* Sorting Algorithms Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-500" />
            Sorting Algorithms
          </h2>

          {/* Algorithm Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Choose an Algorithm:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(algorithms).map(([key, algo]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedAlgorithm(key);
                    reset();
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedAlgorithm === key
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {algorithms[selectedAlgorithm].name}
                </h4>
                <p className="text-gray-600 text-sm">
                  {algorithms[selectedAlgorithm].description}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Time Complexity:</span>
                  <span className="text-sm font-mono bg-red-100 px-2 py-1 rounded">
                    {algorithms[selectedAlgorithm].timeComplexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Space Complexity:</span>
                  <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                    {algorithms[selectedAlgorithm].spaceComplexity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
            
            <button
              onClick={generateRandomArray}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Shuffle size={20} />
              New Array
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="10"
                max="200"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm">{speed}%</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Size:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm">{arraySize}</span>
            </div>
          </div>

          {/* Visualization */}
          <BarChart />

          {/* Step Info */}
          {getCurrentStepInfo() && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-3 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="px-3 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                {getCurrentStepInfo().description}
              </p>
            </div>
          )}

          {/* Expandable sections */}
          <div className="mt-6 space-y-4">
            {/* Code Implementation */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('code')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Code size={20} />
                  <span className="font-medium">Code Implementation</span>
                </div>
                {expandedSections.code ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {expandedSections.code && (
                <div className="p-4 border-t bg-gray-50">
                  <pre className="text-sm overflow-x-auto">
                    <code>{algorithms[selectedAlgorithm].code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Visualization Legend */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('legend')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Eye size={20} />
                  <span className="font-medium">Visualization Legend</span>
                </div>
                {expandedSections.legend ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {expandedSections.legend && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Normal element</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Being compared</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Swapped/Moved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span>Pivot element</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span>Minimum element</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Stacks', 'Queues', 'Linked Lists', 'Binary Trees', 
              'Red Black Trees', 'Hashmaps', 'Tries', 'Graphs', 
              'BFS and DFS', 'P vs NP'
            ].map((topic) => (
              <div key={topic} className="p-4 bg-gray-50 rounded-lg text-center">
                <h3 className="font-medium text-gray-600">{topic}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingAlgorithmsLearning;
