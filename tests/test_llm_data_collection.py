"""
Test LLM Data Collection System
================================
Quick test untuk memastikan semua fungsi bekerja dengan baik
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_predictions_aggregation():
    """Test aggregate_all_predictions_for_llm"""
    print("="*80)
    print("TEST 1: Aggregate All ML Predictions")
    print("="*80)
    
    try:
        from ml.predictions import aggregate_all_predictions_for_llm
        
        print("\n📊 Calling aggregate_all_predictions_for_llm('PIT A')...")
        result = aggregate_all_predictions_for_llm("PIT A")
        
        print(f"\n✅ SUCCESS!")
        print(f"   Location: {result['location']}")
        print(f"   Timestamp: {result['timestamp']}")
        print(f"   Total Models: {result['summary']['total_models']}")
        print(f"   Critical Alerts: {result['summary']['critical_alerts']}")
        print(f"   Avg Confidence: {result['summary']['avg_confidence']*100:.1f}%")
        print(f"   Overall Status: {result['summary']['overall_status']}")
        
        print(f"\n📋 Predictions Collected:")
        for i, (key, pred) in enumerate(result['predictions'].items(), 1):
            status_icon = "🔴" if pred.get('action_required') else "🟢"
            print(f"   {i}. {status_icon} {key}: {pred.get('interpretation', 'N/A')[:80]}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_chatbox_summary():
    """Test get_prediction_summary_for_chatbox"""
    print("\n" + "="*80)
    print("TEST 2: Generate Chatbox Summary")
    print("="*80)
    
    try:
        from ml.predictions import get_prediction_summary_for_chatbox
        
        print("\n📝 Calling get_prediction_summary_for_chatbox('PIT A')...")
        summary = get_prediction_summary_for_chatbox("PIT A")
        
        print(f"\n✅ SUCCESS!")
        print("\n" + "-"*80)
        print(summary)
        print("-"*80)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_context_builder():
    """Test LLMContextBuilder"""
    print("\n" + "="*80)
    print("TEST 3: Context Builder")
    print("="*80)
    
    try:
        from ai.context_builder import get_chatbox_context, get_scenario_context
        
        print("\n🏗️ Testing get_chatbox_context('PIT A')...")
        context = get_chatbox_context("PIT A", "What is the production status?")
        
        print(f"\n✅ Chatbox Context SUCCESS!")
        print(f"   Sections: {len(context)}")
        print(f"   Keys: {', '.join(list(context.keys())[:8])}...")
        
        if 'critical_alerts' in context:
            print(f"   Critical Alerts: {len(context['critical_alerts'])}")
        
        if 'ml_predictions' in context:
            print(f"   ML Predictions: {len(context['ml_predictions'])}")
        
        print("\n🎯 Testing get_scenario_context('PIT A')...")
        scenario_ctx = get_scenario_context("PIT A")
        
        print(f"\n✅ Scenario Context SUCCESS!")
        if 'optimization' in scenario_ctx:
            print(f"   Available Actions: {len(scenario_ctx['optimization'].get('available_actions', []))}")
            print(f"   Constraints: {len(scenario_ctx['optimization'].get('constraints', []))}")
            print(f"   Priorities: {len(scenario_ctx['optimization'].get('priorities', []))}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n")
    print("=" * 80)
    print(" " * 20 + "LLM DATA COLLECTION TEST SUITE")
    print("=" * 80)
    
    results = []
    
    # Test 1: Predictions Aggregation
    results.append(("Predictions Aggregation", test_predictions_aggregation()))
    
    # Test 2: Chatbox Summary
    results.append(("Chatbox Summary", test_chatbox_summary()))
    
    # Test 3: Context Builder
    results.append(("Context Builder", test_context_builder()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST RESULTS SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {name}")
    
    print(f"\n   Total: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! System ready for LLM integration.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please review errors above.")
    
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
