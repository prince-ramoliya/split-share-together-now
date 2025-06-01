
import React from 'react';
import { Plus, Calculator, Save, X } from 'lucide-react';
import { Person, ExpenseRecord } from '../utils/expenseCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseInputFormProps {
  people: Person[];
  expenseName: string;
  setExpenseName: (name: string) => void;
  updatePersonName: (personIndex: number, name: string) => void;
  updateExpense: (personIndex: number, expenseIndex: number, field: keyof ExpenseRecord, value: string | number) => void;
  addExpense: (personIndex: number) => void;
  removeExpense: (personIndex: number, expenseIndex: number) => void;
  addPerson: () => void;
  removePerson: (index: number) => void;
  onCalculate: () => void;
  onSave: () => void;
  isCalculating: boolean;
}

const ExpenseInputForm = ({
  people,
  expenseName,
  setExpenseName,
  updatePersonName,
  updateExpense,
  addExpense,
  removeExpense,
  addPerson,
  removePerson,
  onCalculate,
  onSave,
  isCalculating
}: ExpenseInputFormProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Enter Expense Details
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Add names and multiple expense records for each person
        </p>
      </div>

      {/* Expense Name Input */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle>Expense Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter a name for this expense split (e.g., 'Trip to Goa', 'Weekend Getaway')"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="text-lg"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6">
        {people.map((person, personIndex) => (
          <Card key={personIndex} className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 hover:shadow-lg transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Person {personIndex + 1}</span>
                {people.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePerson(personIndex)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Name *
                </label>
                <Input
                  placeholder="Enter name"
                  value={person.name}
                  onChange={(e) => updatePersonName(personIndex, e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expenses
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addExpense(personIndex)}
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Expense
                  </Button>
                </div>
                
                {person.expenses.map((expense, expenseIndex) => (
                  <div key={expenseIndex} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Amount (₹)"
                        value={expense.amountPaid || ''}
                        onChange={(e) => updateExpense(personIndex, expenseIndex, 'amountPaid', parseFloat(e.target.value) || 0)}
                        className="mb-2"
                        min="0"
                        step="0.01"
                      />
                      <Input
                        placeholder="Description (e.g., Hotel, Food)"
                        value={expense.description}
                        onChange={(e) => updateExpense(personIndex, expenseIndex, 'description', e.target.value)}
                      />
                    </div>
                    {person.expenses.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeExpense(personIndex, expenseIndex)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="outline"
          onClick={addPerson}
          disabled={people.length >= 20}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Person
        </Button>

        <Button
          variant="outline"
          onClick={onSave}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          Save to History
        </Button>

        <Button
          onClick={onCalculate}
          disabled={isCalculating}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Split
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExpenseInputForm;
